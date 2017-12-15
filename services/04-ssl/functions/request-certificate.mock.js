const requestCertificate = require('./request-certificate').handler
const context = require('aws-lambda-mock-context')

const event = {
  RequestType: 'Create',
  ResourceProperties: {
    RootDomain: process.env.domain
  },
  Mock: true
}

requestCertificate(event, context())
.catch(e => console.error(e))