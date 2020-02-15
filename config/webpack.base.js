const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    "babel-loader", 
                    {
                        loader: 'ts-loader', 
                        options: {
                            // 关闭类型检查，即只进行转译， 类型检查交给 fork-ts-checker-webpack-plugin 在别的的线程中做
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                // .css/less 解析
                test: /\.(less|css)$/,
                use: [
                    'style-loader',
                    "css-loader",
                    "postcss-loader",
                    "less-loader",
                    // {
                        // loader: "less-loader",
                        // options: {
                        //     outputStyle: 'expanded',
                        //     compress: false
                        // }
                    // }
                ],
            },
            {
                // 图片解析
                test: /\.(png|jpg|gif)$/,
                include: path.resolve(__dirname, "..", "src"),
                use: ["url-loader?limit=8192&name=assets/image/[name].[hash:4].[ext]"]
            },
        ]
    },
    plugins: [        
        // fork 一个进程进行检查        
        new ForkTsCheckerWebpackPlugin({
            // async 为 false，同步的将错误信息反馈给 webpack，如果报错了，webpack 就会编译失败
            // async 默认为 true，异步的将错误信息反馈给 webpack，如果报错了，不影响 webpack 的编译
            // async: false, 
            // eslint: false,
            checkSyntacticErrors: true
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"], //后缀名自动补全
    }
};