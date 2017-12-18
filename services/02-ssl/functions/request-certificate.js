import ACMClient from 'aws-sdk/clients/acm'
import responder from 'cfn-responder'
import promisify from 'pify'
import retry from 'async-retry'
import foreverSync from 'async.forever'
import pFilter from 'p-filter'
import get from 'lodash.get'

const ACM = new ACMClient({
  apiVersion: '2015-12-08',
  region: 'us-east-1' // ACM certificates must always be stored in us-east-1 with cloudfront
})

const requestCertificate = promisify(ACM.requestCertificate.bind(ACM))
const describeCertificate = promisify(ACM.describeCertificate.bind(ACM))
const listCertificates = promisify(ACM.listCertificates.bind(ACM))
const forever = promisify(foreverSync, { errorFirst: false })

export const handler = async (event, context) => {
  const rootDomain = event.ResourceProperties.RootDomain
  const mock = event.Mock
    
  console.log(`request type is ${event.RequestType}`)
  if (event.RequestType === 'Delete') {
    console.log('will accept this delete, though certificate is not deleted')
    
    return !mock && responder.send(event, context, responder.SUCCESS, {},
      event.PhysicalResourceId, { logLevel: 'debug' })
  }
  
  // check if there is already an issued certificate available with CNAME DNS records
  // the recursion ends when `next` is called with an argument (for pagination purposes)
  // this is then passed as the resolved value of the async function or promise
  let paginationToken
  const existingCertArn = await forever(async next => {
    
    // retrieve issued and pending certificates with a key size that matches cloudfront
    const {
      NextToken: nextToken,
      CertificateSummaryList: acmCertifactesList
    } = await listCertificates({
      CertificateStatuses: ['ISSUED', 'PENDING_VALIDATION'],
      Includes: {
        keyTypes: ['RSA_2048']
      },
      NextToken: paginationToken,
      MaxItems: 1000
    })
    paginationToken = nextToken
    
    // filter for specified root domain and only return certificates with dns validation
    const matches = await pFilter(acmCertifactesList, async cert => {
      if (cert.DomainName !== rootDomain) return false
      
      return !!get(await describeCertificate({
        CertificateArn: cert.CertificateArn
      }), 'Certificate.DomainValidationOptions[0].ResourceRecord')
    })
    console.log(`found ${matches.length} existing certificates for domain ${rootDomain}`)
    
    // break pagination if we have a match or there are no remaining results
    if (matches.length || !paginationToken) {
      next(matches.length ? matches[0].CertificateArn : new Error('no results'))
    }
    else {
      next()
    }
  })
  
  // pick existing or new certificate
  let acmArn
  if (typeof existingCertArn !== 'string') {
    const { CertificateArn: newCertArn } = await requestCertificate({
      DomainName: rootDomain,
      SubjectAlternativeNames: [`www.${rootDomain}`],
      ValidationMethod: 'DNS'
    })
    console.log(`requested new certificate with arn ${newCertArn}`)
    acmArn = newCertArn
  }
  else {
    console.log(`using existing certificate with arn ${existingCertArn}`)
    acmArn = existingCertArn
  }
  
  // describe the certificate to retrieve DNS validation records
  let certificateDescription
  await retry(async (bail, attempt) => {
    ;({ Certificate: certificateDescription } = await describeCertificate({
      CertificateArn: acmArn
    }))
  
    // validate that certificate status
    console.log(`#${attempt} attempt to describe certificate: %j`, certificateDescription)
    if (!['PENDING_VALIDATION', 'ISSUED'].includes(certificateDescription.Status)) {
      console.log('certificate is not yet issued and is not pending validation')
  
      return bail(!mock && responder.send(event, context, responder.FAILED, {
        err: new Error(`requested acm certificate has unexpected 
          status of ${certificateDescription.Status}`)
      }, acmArn, { logLevel: 'debug' }))
    }
  
    // if it does not yet have DNS records
    if (!get(certificateDescription, 'DomainValidationOptions[0].ResourceRecord')) {
      throw new Error(`domain is in special state where it is issued or pending validation 
        but DNS CNAME records are not yet available; should retry`)
    }
  }, { retries: 50, factor: 2, minTimeout: 5000, maxTimeout: 30000 })
  
  // destructure the certificate description to retrieve validation dns records
  console.log('destructuring with certificate: %j', certificateDescription)
  const {
    DomainValidationOptions: [
      {
        ResourceRecord: {
          Name: rootRecordName,
          Value: rootRecordValue
        }
      },
      {
        ResourceRecord: {
          Name: wwwRecordName,
          Value: wwwRecordValue
        }
      }
    ]
  } = certificateDescription
  
  console.log(`received validation records with root name ${rootRecordName},
    root value ${rootRecordValue}, www name ${wwwRecordName}, and www value ${wwwRecordValue}`)
  
  // the custom resource is physically identified by the arn of the certificate
  return !mock && responder.send(event, context, responder.SUCCESS, {
    acmArn,
    rootRecordName,
    rootRecordValue,
    wwwRecordName,
    wwwRecordValue
  }, acmArn, { logLevel: 'debug' })
}