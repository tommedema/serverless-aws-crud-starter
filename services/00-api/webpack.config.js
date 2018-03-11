/*
  See https://github.com/serverless-heaven/serverless-webpack/issues/301#issuecomment-350690166
  for information on how to access serverless options (incl. stage/environment) and more.
*/

const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')
const path = require('path')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  stats: 'minimal',
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
    sourceMapFilename: "[file].map"
  },
  externals: [
    nodeExternals({ modulesDir: path.resolve(__dirname, './node_modules') }),
    nodeExternals({ modulesDir: path.resolve(__dirname, '../../node_modules') })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      }
    ]
  }
}
