const utils = require('./utils')
const config = require('./_config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const pages = utils.getEntry(utils.resolve('src/view/**/*.{ftl,html')); // view下html,ftl入口是会唯一一个

let plugins = [], entries = {base: ['babel-polyfill']};
// 多入口文件配置
for (var pathname in pages) {
  // 配置生成的html文件，定义路径等
  let jsfile = pages[pathname].split('.html')[0] +'.js'// JS文件路径
  entries[pathname]= jsfile;

  // 根据生产开发环境来决定HtmlWebpackPlugin 入口文件后缀
  var ext = isProduction ? path.parse(pages[pathname]).ext : '.html';
  var conf = {
    filename: pathname + ext,
    template: pages[pathname] , // 模板路径
    chunks: [pathname, 'vendor', 'manifest'], // 每个html引用的js模块
    inject: true           // js插入位置
  };
  // 需要生成几个html文件，就配置几个HtmlWebpackPlugin对象
 plugins.push(new HtmlWebpackPlugin(conf));
}

module.exports = {
    entry: entries,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': utils.resolve('src'),
        'js': utils.resolve('src/js'),
        'components': utils.resolve('src/components'),
      }
    },
    plugins: plugins,
    module: {
      rules: [
				// 静态html模板
				{
					test: /\.(html|tpl)$/,
					loader: 'html-withimg-loader'
				},
				// .vue文件
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
            preserveWhitespace: false,
						loaders: utils.cssLoaders({
							sourceMap: isProduction ? false : true,
							extract: isProduction ? true : false,
						})
					}
				},
				// .js文件
				{
					test: /\.js$/,
					loader: 'babel-loader',
          exclude: /node_modules\/(?!(iview)\/).*/  // @NOTE
				},
				// 图片资源
				{
					test: /\.(jpeg|jpg|png|gif)$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 10240,
							name: utils.assetsPath('images/[name]-[hash:8].[ext]')
						}
					}
				},
				// 字体资源等
				{
					test: /\.(ttf|woff|woff|eot|svg)$/,
					use: {
						loader: 'url-loader',
						options: {
							limit: 10240,
							name: utils.assetsPath('font/[name]-[hash:8].[ext]')
						}
					}
				}
			].concat(utils.styleLoaders({
        sourceMap: isProduction ? false : true,
        extract:isProduction ? true : false,
      }))
    },

}
