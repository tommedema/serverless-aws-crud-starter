module.exports = (serverless, awsInfo) => {
  if (!awsInfo) {
    const getServerlessPlugin = require('./get-serverless-plugin')(serverless)
    awsInfo = getServerlessPlugin('AwsInfo')
  }

  return key => {
    const entry = awsInfo.gatheredData.outputs.find(o => o.OutputKey === key)
    return entry && entry.OutputValue
  }
}