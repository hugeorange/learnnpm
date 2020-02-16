# learnnpm
学习 npm 开发，webpack 打包，ts、babel 构建

## 如何使用
- 安装 `yarn add learnnpm-o`
- 使用示例
  
  ```js
  import LearnNpm from 'learnnpm-o';

  <LearnNpm
    env='test'
    useSide="app"
    matchId="651023204059447296"
    afterUpdatePage={() => {}} // 页面更新后的回调 
  />
  ```

### 二次开发
1. `https://github.com/hugeorange/learnnpm.git`
2. `yarn install & npm run start`
3. 本地开发调试目录 `/example/src/index.js`
4. 本地调试完成之后，执行`npm run build`，然后再使用 [npm link](https://github.com/atian25/blog/issues/17)，把npm包代理到本地进行调试，调试完成后在进行发布(防止频繁发包)
5. 一切调试完成后，执行 `npm run pub` 进行发包（需先注册登录 npm）

### npm 注册登录
- 前置条件: 切到对应的npm源
1. npm logout 
2. npm login 
3. 依次输入账号、密码、邮箱 
4. npm publish 
- npm 发布时可能遇到的[问题](https://blog.csdn.net/mrchengzp/article/details/78358994)
  1. 源出错
  2. 包名重复

### 项目目录
```js
|____.babelrc
|____config // webpack 配置
|____example // 开发环境调试目录
|____node_modules 
|____README.md
|____yarn.lock
|____public 
|____.gitignore
|____package.json
|____lib // 打包后目录
|____tsconfig.json // ts配置
|____postcss.config.js // postcss配置
|____src // 组件源码
```
### 打包方式（该分支）
- ts-loader + tsc + tsconfig.json 将 tsx 处理为 es6
- babel-loader + babelrc 接盘将 es6 按照 @babel/presents-env处理为 es5代码
- 话外音: `ts-loader` 与 `new ForkTsCheckerWebpackPlugin` 配合 ==> webpack4之后happypack作用也小了故不用了
