const execa = require('execa')
const getOutputFactory = require('../../../../lib/get-cf-output')
const getServiceOutputFactory = require('../../../../lib/get-service-output')
const readPkg = require('read-pkg')
const path = require('path')
const rootPkg = readPkg.sync(path.resolve(process.cwd(), '../..'))
const projectName = rootPkg.name

class DeployReactApp {
  constructor(serverless, options) {
    // members
    this.serverless = serverless
    this.options = options
    this.getOutput = getOutputFactory(serverless)
    this.getServiceOutput = getServiceOutputFactory(serverless, options, projectName)
    
    // bindings
    this.log = this.log.bind(this)
    this.deployApp = this.deployApp.bind(this)
    
    // hooks
    this.hooks = {
      'after:aws:info:gatherData': this.deployApp
    }
  }
  
  async deployApp() {
    this.log('compiling web app with cloudformation outputs')

    const region = this.options.region || this.serverless.service.provider.region
    const webBucketName = this.getOutput('WebBucketName')
    const webCloudfrontDistId = this.getOutput('WebCloudfrontDistId')
    const cognitoUserPoolId = await this.getServiceOutput('auth', 'CognitoUserPoolId')
    const cognitoUserPoolClientId = await this.getServiceOutput('auth', 'CognitoUserPoolClientId')
    const cognitoIdentityPoolId = await this.getServiceOutput('auth', 'CognitoIdentityPoolId')
    const apiRoot = await this.getServiceOutput('api', 'ServiceEndpoint')
    const attachmentsBucketName = undefined
    
    this.log(`gathered cloudformation outputs:
      region: ${region}
      apiRoot: ${apiRoot}
      attachmentsBucketName: ${attachmentsBucketName}
      cognitoUserPoolId: ${cognitoUserPoolId}
      cognitoUserPoolClientId: ${cognitoUserPoolClientId}
      cognitoIdentityPoolId: ${cognitoIdentityPoolId}
      webBucketName: ${webBucketName}
      webCloudfrontDistId: ${webCloudfrontDistId}`)

    this.log('compiling and deploying for web')
      
    await execa('npm', ['run', 'build'], {
      env: {
        REACT_APP_AWS_REGION: region,
        REACT_APP_API_ROOT: apiRoot,
        REACT_APP_ATTACHMENTS_BUCKET: attachmentsBucketName,
        REACT_APP_COGNITO_USER_POOL_ID: cognitoUserPoolId,
        REACT_APP_COGNITO_USER_POOL_CLIENT_ID: cognitoUserPoolClientId,
        REACT_APP_COGNITO_IDENTITY_POOL_ID: cognitoIdentityPoolId
      },
      cwd: `${process.cwd()}/app`,
      stdout: process.stdout
    })
    
    const sync = await execa('aws', ['s3', 'sync', 'build/', `s3://${webBucketName}`], {
      cwd: `${process.cwd()}/app`,
      stdout: process.stdout
    })
    
    const invalidate = await  execa('aws', ['cloudfront', 'create-invalidation',
      '--distribution-id', webCloudfrontDistId, '--paths', '/*'], { stdout: process.stdout })
  }
  
  log(msg) {
    this.serverless.cli.log(`Deploy-react-app: ${msg}`)
  }
}

module.exports = DeployReactApp