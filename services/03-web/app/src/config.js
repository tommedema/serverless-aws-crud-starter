// a list of environment variables to be injected into app build
const envVars = {
  REACT_APP_AWS_REGION: 'REACT_APP_AWS_REGION',
  REACT_APP_API_ROOT: 'REACT_APP_API_ROOT',
  REACT_APP_ATTACHMENTS_BUCKET: 'REACT_APP_ATTACHMENTS_BUCKET',
  REACT_APP_COGNITO_USER_POOL_ID: 'REACT_APP_COGNITO_USER_POOL_ID',
  REACT_APP_COGNITO_USER_POOL_CLIENT_ID: 'REACT_APP_COGNITO_USER_POOL_CLIENT_ID',
  REACT_APP_COGNITO_IDENTITY_POOL_ID: 'REACT_APP_COGNITO_IDENTITY_POOL_ID'
}

// throw if any environment variables are not defined during build
for (var envVar in envVars) {
  if (typeof process.env[envVar] === 'undefined') {
    throw new Error(`${envVar} env var was not defined during build`)
  }
}

export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  cognito: {
    USER_POOL_ID: process.env[envVars.REACT_APP_COGNITO_USER_POOL_ID],
    APP_CLIENT_ID: process.env[envVars.REACT_APP_COGNITO_USER_POOL_CLIENT_ID],
    REGION: process.env[envVars.REACT_APP_AWS_REGION],
    IDENTITY_POOL_ID: process.env[envVars.REACT_APP_COGNITO_IDENTITY_POOL_ID]
  },
  apiGateway: {
    URL: process.env[envVars.REACT_APP_API_ROOT],
    REGION: process.env[envVars.REACT_APP_AWS_REGION]
  },
  s3: {
    BUCKET: process.env[envVars.REACT_APP_ATTACHMENTS_BUCKET]
  }
}