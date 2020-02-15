const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                // 使用 babel-loader 来编译处理 js 和 jsx 文件
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(ts|tsx)$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                // .css/less 解析
                test: /\.(less|css)$/,
                use: [
                    'style-loader',
                    "css-loader",
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        // options: {
                        //     outputStyle: 'expanded',
                        //     compress: false
                        // }
                    }
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
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"], //后缀名自动补全
    }
};