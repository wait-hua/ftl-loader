
process.env.NODE_ENV = 'development'

const webpack = require('webpack')
const merge = require('webpack-merge')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./utils')
const config = require('./_config')
const baseWebpackConfig = require('./_base')

module.exports = merge(baseWebpackConfig, {
  output: {
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js')
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  module:{
    rules: [{
      test: /.ftl$/,
      use: [{
        loader: 'html-withimg-loader'
      }, {
        loader: 'ftl-loader',
        options: {
          viewRoot: path.resolve(__dirname, '../src/view/'),
          mockRoot: path.resolve(__dirname, '../mock/')
        }
      }]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ],
  devServer: {
    inline: true,
    hot: true,
    port: config.dev.port,
    disableHostCheck: true,
    host:'localhost',
    open: true,
    proxy: config.dev.proxy,
    publicPath: config.dev.publicPath
  }
})
