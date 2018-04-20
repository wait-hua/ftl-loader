var utils = require('loader-utils'),
    path = require('path'),
    Freemarker = require('freemarker.js'),
    fs = require('fs');

module.exports = function(source) {
    this.cacheable && this.cacheable();

    const callback = this.async(); // 异步解析模块
    let _options = utils.getOptions(this);

    // 初始化freemark.js，必须传入viewRoot
    let fm = new Freemarker({
        viewRoot: _options.viewRoot || '/'
    });
    // 获得文件名称
    let _filename = this.resourcePath.split(this.context)[1];

    // fm.renderSync(filename) freemark.js里面获取文件路径会path.join(viewRoot, filename);
    // 当传入的viewRoot 不是根路径的时候，需要取得相对根路径的文件路径。
    let fmname = (_options.viewRoot!='/') ? path.relative(_options.viewRoot,this.resourcePath): this.resourcePath;

    if(_options.mockRoot){
        // 获取mock数据 取与文件名同名称的 json文件
        let _mockfile = _options.mockRoot + _filename.split('.')[0] +'.json';

        // 添加依赖关系，当文件修改时会被webpack检测到
        this.addDependency(_mockfile);
        
        fs.readFile(_mockfile, 'utf-8', function(err, text){
            if(err) {
                let template = fm.renderSync(fmname, {}); // 读取mock文件失败时，不使用mock数据
                return callback(null, template);
            }
            let data = JSON.parse(text);
            let template = fm.renderSync(fmname, data);
            callback(null, template);
        })
        // _mockdata = require(_mockfile);

    }else{
        let template = fm.renderSync(fmname, {});
        callback(null, template);
    }

};