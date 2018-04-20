
process.env.NODE_ENV = 'production'

const webpack = require('webpack')
const merge = require('webpack-merge')
const utils = require('./utils')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const rm = require('rimraf')
const ora = require('ora')
const chalk = require('chalk')
const config = require('./_config')

const baseWebpackConfig = require('./_base')


var webpackConfig = merge(baseWebpackConfig, {
  output: {
    path: config.build.distPath,
    publicPath: '/',
    filename: utils.assetsPath('js/[name]-[chunkhash:8].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),

    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // 对于代码分割的文件样式也压缩到一个文件上, 没有配置这个的时候异步组件
      // 会动态的插入style标签到header头部加载样式，但是在build打包的抽取的时候出现了
      // 某些组件样式丢失的问题，换成不是异步组件就ok了。
      allChunks: true,

    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true // 避免 cssnano 重新计算 z-index
      }
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
  ]
})


// module.exports = webpackConfig
var spinner = ora('building for production...')
spinner.start()

rm(config.build.distPath, err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))

  })
})
