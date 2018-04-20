const path = require('path')

module.exports = {
  dev : {
    port: 3004,
    assetsSubDirectory:'static',
    publicPath: '/',
    proxy: {
      '/api':{
        target:'http://10.242.13.200:8080',
        changeOrigin:true,
        secure: false
      }
    }
  },
  build : {
    distPath: path.resolve(__dirname, '../dist'), // 打包文件输出路径
    assetsSubDirectory: 'static', // 打包输出的静态资源（js,css,image）路径，
    publicPath: '/', // 要上cdn的时候配置路径为CDN资源路径


  }
}
