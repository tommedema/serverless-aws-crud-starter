module.exports = (serverless, options, projectName) => async (service, key) =>
  await serverless.variables
    .getValueFromCf(`cf:${projectName}-${service}-${options.stage}.${key}`)