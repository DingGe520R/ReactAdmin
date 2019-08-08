const { override, fixBabelImports, addLessLoader  } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        //针对 antd 实现按需打包：根据 import来打包
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, //自动打包 相关样式
    }),
    
    //使用 less_loader 对源码中的 less 的变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#1DA57A' },
    })
);

