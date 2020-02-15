const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.js'); // 引用公共配置

const devConfig = {
    mode: 'development', // 开发模式
    entry: path.join(__dirname, "../example/src/app.js"), // 项目入口，处理资源文件的依赖关系
    output: {
        path: path.join(__dirname, "../example/src/"),
        filename: "bundle.js", // 使用webpack-dev-sevrer启动开发服务时，并不会实际在`src`目录下生成bundle.js，打包好的文件是在内存中的，但并不影响我们使用。
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '赛后贴演示',
            filename: "index.html",
            template: "./public/index.html",
            inject: true,
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, '../example/src/'),
        compress: true,
        port: 3001, // 启动端口为 3001 的服务
        // open: true // 自动打开浏览器
    },
};
module.exports = merge(devConfig, baseConfig); // 将baseConfig和devConfig合并为一个配置
