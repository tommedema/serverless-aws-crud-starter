const get = require('lodash.get')
const util = require('util')
const ACMClient = require('aws-sdk/clients/acm')
const promisify = require('pify')
const getServerlessPluginFactory = require('../../../../lib/get-serverless-plugin')
const getOutputFactory = require('../../../../lib/get-cf-output')
const ServerlessError = require('serverless/lib/classes/Error').ServerlessError

const ACM = new ACMClient({
  apiVersion: '2015-12-08',
  region: 'us-east-1' // ACM certificates must always be stored in us-east-1 with cloudfront
})

const describeCertificate = promisify(ACM.describeCertificate.bind(ACM))

class SubstituteCertificateValid {
  constructor(serverless) {
    // members
    this.serverless = serverless
    this.provider = this.serverless.getProvider('aws')
    this.getServerlessPlugin = getServerlessPluginFactory(this.serverless)
    this.awsInfo = this.getServerlessPlugin('AwsInfo')
    this.getOutput = getOutputFactory(this.serverless, this.awsInfo)
    
    // bindings
    this.beforeWritingCfTemplate = this.beforeWritingCfTemplate.bind(this)
    this.updateCondition = this.updateCondition.bind(this)
    this.log = this.log.bind(this)
    
    // hooks
    this.hooks = {
      'before:aws:package:finalize:saveServiceState': this.beforeWritingCfTemplate
    }
  }
  
  beforeWritingCfTemplate() {
    return this.awsInfo.getStackInfo()
    .then(() => { 
      const acmArn = this.getOutput('CertificateArn')
      if (!acmArn) {
        this.log('no certificate found, setting certificate status to invalid')
        this.updateCondition(false)
      }
      else {
        this.log(`found certificate with arn ${acmArn}`)
        
        // describe the certificate and set isValid = true if status is ISSUED
        return describeCertificate({
          CertificateArn: acmArn
        })
        .then(({ Certificate: { Status: status } }) => {
          const isValid = (status === 'ISSUED')
          this.log(`certificate status is ${status},
            setting certificate valid condition to ${isValid}`)
          this.updateCondition(isValid)
        })
      }
    })
    .catch(err => {
      if (err instanceof ServerlessError && err.message.indexOf('does not exist') !== -1) {
        this.log(`ssl stack is not yet created, setting certificate status to invalid
          the certificate status will be re-checked in future deploys`)
        this.updateCondition(false)
      }
      else {
        throw err
      }
    })
  }
  
  updateCondition(bool) {
    // retrieve the original condition
    let condition = get(this.serverless,
      ['service', 'provider', 'compiledCloudFormationTemplate',
      'Conditions', 'ShouldConsumeCertificate'])
      
    // update the condition
    const updatedCondition = JSON.parse(
      JSON.stringify(condition).replace('%SCRIPT_SUBSTITUTE_CERTIFICATE_IS_VALID%', '' + bool))
    
    // overwrite the template
    condition = Object.assign(condition, updatedCondition)
  }
  
  log(msg) {
    this.serverless.cli.log(`Substitute-certificate-valid: ${msg}`)
  }
}

module.exports = SubstituteCertificateValid