const ServerlessError = require('serverless/lib/classes/Error').ServerlessError

module.exports = (serverless, options, projectName) => async (service, key) => {
  try {
    return await serverless.variables
      .getValueFromCf(`cf:${projectName}-${service}-${options.stage}.${key}`)
  }
  catch (err) {
    if (err instanceof ServerlessError
      && (err.message.indexOf('does not exist') !== -1)
        || (err.message.indexOf('non exported variable') !== -1)
    ) {
      return null
    }
    else {
      throw err
    }
  }
}