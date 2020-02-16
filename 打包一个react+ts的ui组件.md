## 打包一个 react & typescript 的ui组件
### npm 注册登录
- 前置条件: 切到对应的npm源
1. `npm logout `
2. `npm login` 
3. `依次输入账号、密码、邮箱 `
4. `npm publish` 
- npm 发布时可能遇到的[问题](https://blog.csdn.net/mrchengzp/article/details/78358994)
  1. 源出错
  2. 包名重复
  3. 每次发布前要修改`package.json`的版本号，必须要大于上一次的版本号
- [npm link 本地调试](https://github.com/atian25/blog/issues/17)：为调试带来的频繁发包，可以使用 npm link 将npm包代理到本地调试，操作步骤：
  1. 进入源码目录执行 `npm link`
  2. 进入使用目录即示例代码执行 `npm link [包名]`，折后就可以直接在示例代码处使用 `import xxx from 'xxx'` 进行调试了



### webpack ts babel 等打包配置文件书写
> 参照这篇[文章](https://juejin.im/post/5d6760b3e51d453b8b5fa60b)写的挺全面的，只不过它没有引入`typescript`
- 本文写时 `"webpack": "^4.41.6",`，下面把主要流程记录一下最终完成的目录结构如下所示
    ```js
    |____babelrc // babel 配置
    |____config  // webpack配置
        ├── webpack.base.js // 公共配置
        ├── webpack.dev.config.js // 开发环境配置
        └── webpack.prod.config.js // 打包发布环境配置
    |____example // 开发环境调试目录
    |____node_modules 
    |____README.md
    |____yarn.lock
    |____public // 开发调试环境的模板 index.html
    |____.gitignore
    |____package.json
    |____lib // 打包后目录
    |____tsconfig.json // ts配置
    |____postcss.config.js // postcss配置
    |____src // 组件源码
    |____.npmignore // 指定发布 npm 的时候需要忽略的文件和文件夹
    ```

1. `mkdir learnnpm & cd learnnpm & npm init`，根据提示依次填入信息，之后即生成 `package.json`
2. 依次安装依赖
    ```js
    1. 因为使用webpack进行打包，安装webpack相关依赖
       主依赖： yarn add webpack webpack-cli webpack-dev-server webpack-merge -D
       相关插件：clean-webpack-plugin html-webpack-plugin mini-css-extract-plugin

    2. 安装react相关
       yarn add react react-dom 

    3. 安装babel相关
       yarn add @babel/cli @babel/core @babel/preset-env @babel/preset-react babel-loader @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread -D
    
    4. 安装 typescript ts-loader fork-ts-checker-webpack-plugin
    
    5. 安装css相关
       style-loader css-loader postcss-loader less less-loader
       url-loader file-loader
       autoprefixer
    ```
    - 完成以上步骤 `package.json` `.babelrc` `webpack.config.js` `postcss.config.js`相关内容如下
    ```js
    {
        // ...
        "main": "lib/index.js", // 打包后的入口地址
        "scripts": {
            "start": "webpack-dev-server --config config/webpack.dev.config.js",
            "build": "webpack --config config/webpack.prod.config.js",
            "pub": "npm run build && npm publish" // 发布 npm
        },
        // ...
        "dependencies": {
            "react": "^16.12.0",
            "react-dom": "^16.12.0"
        },
        "devDependencies": {
            "@babel/cli": "^7.8.4",
            "@babel/core": "^7.8.4",
            "@babel/preset-env": "^7.8.4",
            "@babel/preset-react": "^7.8.3",
            "@babel/plugin-proposal-class-properties": "^7.8.3",
            "@babel/plugin-proposal-object-rest-spread": "^7.8.3",
            "@types/react": "^16.9.19", // ts 需要用的相关库types 文件
            "@types/react-dom": "^16.9.5",
            "@types/react-router-dom": "^5.1.3",
            "autoprefixer": "^9.7.4",
            "babel-loader": "^8.0.6",
            "clean-webpack-plugin": "^3.0.0",
            "css-loader": "^3.4.2",
            "fork-ts-checker-webpack-plugin": "^0.5.2", // ts类型校验webpack插件
            "html-webpack-plugin": "^3.2.0",
            "less": "^3.11.1",
            "less-loader": "^5.0.0",
            "mini-css-extract-plugin": "^0.9.0", // 抽离css插件
            "postcss-loader": "^3.0.0",
            "style-loader": "^1.1.3",
            "ts-loader": "^6.2.1",
            "typescript": "^3.7.5",
            "url-loader": "^3.0.0",
            "webpack": "^4.41.6",
            "webpack-cli": "3.3.7",
            "webpack-dev-server": "^3.10.3",
            "webpack-merge": "^4.2.2"
        },
        "browserslist": [ // postcss autoprefixer 用到的配置
            "iOS >= 6",
            "Android >= 4",
            "IE >= 9"
        ]
    }
    ```
    - .babelrc
    ```json
    {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react",
        ],
        "plugins": [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread"
        ]
    }
    ```
    - .postcss.config.js
    ```js
    // postcss 配置参考 https://segmentfault.com/a/1190000008030425
    module.exports = {
        plugins: [
            require('autoprefixer')({ /* ...options */ })
        ]
    }
    ```
    - webpack.base.js
    ```js
    const path = require('path');

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
                        "less-loader"
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
            //后缀名自动补全，引入时可不必写后缀名
            extensions: [".ts", ".tsx", ".js", ".jsx", ".less", ".css"]
        }
    };
    ```
    - webpack.dev.config.js
    ```js
    const path = require('path');
    const merge = require('webpack-merge');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const baseConfig = require('./webpack.base.js');

    const devConfig = {
        mode: 'development', // 开发模式
        entry: path.join(__dirname, "../example/src/app.js"), // 项目入口，处理资源文件的依赖关系
        output: {
            path: path.join(__dirname, "../example/src/"),
            filename: "bundle.js", 
            // 使用webpack-dev-sevrer启动开发服务时，并不会实际在`src`目录下生成bundle.js，打包好的文件是在内存中的，但并不影响我们使用。
        },
        module: {
            rules: []
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'learn npm',
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
    module.exports = merge(devConfig, baseConfig);
    ```
    - webpack.prod.config.js
    ```js
    const path = require('path');
    const merge = require('webpack-merge');
    const baseConfig = require('./webpack.base.js');
    // const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 用于将组件的css打包成单独的文件输出到`lib`目录中
    const { CleanWebpackPlugin } = require('clean-webpack-plugin');

    const prodConfig = {
        mode: 'production',
        entry: path.join(__dirname, "../src/index.tsx"),
        output: {
            path: path.join(__dirname, "../lib/"),
            filename: "index.js",
            libraryTarget: 'umd', // 采用通用模块定义
            libraryExport: 'default', // 兼容 ES6 的模块系统、CommonJS 和 AMD 模块规范
        },
        module: {
            rules: [
                // 我在打包的没有做css抽离，故注释了
                // {
                //     test: /\.css$/,
                //     loader: [MiniCssExtractPlugin.loader, 'css-loader?modules'],
                // },
            ]
        },
        plugins: [
            // new MiniCssExtractPlugin({
            //     filename: "main.min.css" // 提取后的css的文件名
            // }),
            new CleanWebpackPlugin(),
        ],
        externals: { // 定义外部依赖，避免把react和react-dom打包进去
            react: {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react",
            },
            "react-dom": {
                root: "ReactDOM",
                commonjs2: "react-dom",
                commonjs: "react-dom",
                amd: "react-dom",
            }
        },
    };
    module.exports = merge(prodConfig, baseConfig); 
    ```
    - tsconfig.json 我把ts强制类型校验都关掉了 [ts配置详解](https://lq782655835.github.io/blogs/project/ts-tsconfig.html#_1-experimentaldecorators)、[配置](https://www.tslang.cn/docs/handbook/compiler-options.html)、 [ts学习](https://juejin.im/post/595cc34ff265da6c3d6c262b)
    ```js
    {
        "compilerOptions": {
            "target": "es6",
            "experimentalDecorators": true,
            "strictNullChecks": false,
            "module": "ESNext",
            "moduleResolution": "node",
            "jsx": "react",
            "noUnusedParameters": false,
            "noUnusedLocals": false,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "skipLibCheck": true,
            "noImplicitAny": false,
            "noImplicitReturns": false,
            "noFallthroughCasesInSwitch": false,
            "alwaysStrict": false,
            "strict": false,
            "strictBindCallApply": false,
            "strictPropertyInitialization": false,
            "types": [
                "react",
                "react-dom",
                "node"
            ],
            // "baseUrl": "src",
            // 此处相当于webpack alias
            // "paths": {
            //     "src/*": [
            //         "*"
            //     ]
            // }
        },
        "include": [
            "src/"
        ],
        "exclude": [
            "node_modules",
            "dist"
        ],
        "compileOnSave": false
    }
    ```

### ts 和 babel
> 上述配置使用的 `babel ts` 的工作方式为 `tsx -(ts-loader) -> es6 -(babel-loader) -> es5 ` 即本项目的 `ts-loader` 分支

- 我这个项目的 master分支并没有使用上述文章介绍的几种方式，我是直接使用 tsc 编译器(利用tsconfig.json配置)，将源代码tsx直接编译成es5，即只用 ts-loader 处理 ts、tsx，tsconfig.json 的target设置成es5，引入之后运行良好，暂未发现异常

#### ts 与 babel几种协同工作方式
- 主要参考这几篇[Webpack 转译 Typescript 现有方案](https://juejin.im/post/5e2690dce51d454d310fb4ef)

- 综上所述，大致有以下两种方案
1. ts-loader + babel-loader
```js
`ts-loader + tsc + tsconfig.json` 将 tsx 处理为 es6

`babel-loader + babelrc` 接盘将 es6 按照 `@babel/presents-env` 处理为 es5代码

话外音: `ts-loader` 与 `new ForkTsCheckerWebpackPlugin` 配合 ==> webpack4之后`happypack`作用也小了，故不用了

如上文所配置
```
2. `babel7 + @babel/preset-typescript`
   - [Babel 7 下配置 TypeScript 支持
](https://zhuanlan.zhihu.com/p/102250469)
   -  [两个小优化，webpack打包速度飞起来
](https://juejin.im/post/5cc81368518825750351a50f)
```
引入 @babel/preset-typescript，来处理 tsx 类型信息（其作用就是删除ts类型信息）

webpack 配置 js、jsx、ts、tsx 都交由babel-loader 处理

另外在启动一个 tsc 服务检查代码类型 tsc --watch (package.json npm 脚本·

```

##### 上述不管每种方法最终的结果都是只转换高版本ES的语法或者将TypeScript转换为ES5语法，但并不转换api
- 语法：let、const、class、Decorator
- api：includes、Object.assign、Array.from、Promise、async await
- 语法靠`@babel/preset-env`的相关配置进行转义
- api靠 `@babel/polyfill` 或 `@babel/runtime`和`@babel/plugin-transform-runtime`
---
- update：tsc 编译器好像可以带上[polyfill](https://www.zhihu.com/question/320817212)/[知乎提问/ts-polyfill](https://www.zhihu.com/question/322722786)
---
- `有个疑问我现在也没有明确答案？`
  ```js
  像我们写的这些 npm包或ui组件库，需不需要自己做 polyfill？
  还是交给使用方即宿主环境做

  我看了 `antd-mobile` 打包后的文件，发现像 `Promise, Object.assign`并没有做polyfill
  ```

  ### babel相关-@babel/polyfill、@babel/preset-env、@babel/plugin-transform-runtime
  - 参考文章
  1. [Babel学习系列1-Babel历史](https://zhuanlan.zhihu.com/p/57530472)
  2. [Babel学习系列2-Babel设计，组成](https://zhuanlan.zhihu.com/p/57883838)
  3. [Babel学习系列3-babel-preset,babel-plugin](https://zhuanlan.zhihu.com/p/58080752)
  4. [Babel学习系列4-polyfill和runtime差别(必看)](https://zhuanlan.zhihu.com/p/58624930)
  5. [Babel 编译出来还是 ES 6？难道只能上 polyfill？](https://www.zhihu.com/question/49382420/answer/223915243)
  6. [这个网站，可以让你停止“瞎配”前端工具链](https://zhuanlan.zhihu.com/p/55743174)
  7. [https://www.tangshuang.net/7427.html](https://www.tangshuang.net/7427.html)
  - 动态polyfill方案主要是依据 `@babel/preset-env` 的 `useBuiltIn`确定的
  - `@babel/babel-polyfill` 整个应用全局引入，模拟完整的ES6+环境
  - `@babel/babel-runtime @babel/babel-plugin-transform-runtime` 开发像vue这样的框架、库，提供一个沙盒环境不会污染原型链，后者主要为前者提供引用帮助，减少代码体积
