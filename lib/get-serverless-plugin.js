module.exports = serverless => {
  return pluginName =>
    serverless.pluginManager.plugins.find(p => p.constructor.name === pluginName)
}