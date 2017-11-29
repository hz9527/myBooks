目录  
[CLI](#cli)  
[node](#node)  
[module](#module)    

## CLI
简单使用
1. 使用配置文件
2. 直接打包入口出口

```sh
webpack --config ./build/config.js

webpack ./src/index.js ./dist/bundle.js

# 多入口
webpack index=./src/index.js entry2=./src/index2.js dist/bundle.js
```

## node
### node api
如果只需要运行一次webpack
```JavaScript
webpack(config, (err, stats) => {
  if (err || stats.hasErrors()) {
    // err
  } else {
    // deal
  }
})
```
也可以主动触发打包
```JavaScript
var compiler = webpack(config)
compiler.run((err, stats) => {
  // ...
})
```
还可以watch
```JavaScript
var compiler = webpack(config)
var watch = compiler.watch(watchConf, (err, stats) => {
  // ..
})
// close watch
watch.close(cb)
```

### stats
stats主要用于暴露警告，报错信息，计时信息，module 和 chunk 信息等。有一系列方法  
`stats.hasErrors()`  
`stats.hasWarnings()`  
`stats.toJson(options)`
`stats.toString(options)`相对前者仅添加了color属性

### 文件系统
默认情况下，webpack 使用普通文件系统来读取文件并将文件写入磁盘。但是，还可以使用不同类型的文件系统（内存(memory), webDAV 等）来更改输入或输出行为
```JavaScript
const MemoryFS = require("memory-fs");
const webpack = require("webpack");

const fs = new MemoryFS();
const compiler = webpack({ /* options*/ });

compiler.outputFileSystem = fs;
compiler.run((err, stats) => {
  // 之后读取输出：
  const content = fs.readFileSync("...");
});
```
> webpack-dev-serve or webpack-dev-middleware也都是用了此原理，将所有资源放置在内存里


## module
主要讲讲异步模块，其实都是Promise
```JavaScript
var M1 = () => import('src') // 按需加载

import('src')
  .then(M => { // arg is module
    // ...
  })

import(
  /* webpackChunkName: "Module1" */
  /* webpackMode: "lazy" */
  'src'
)
// 以注释形式注入供webpack解析使用 name 包名
// mode lazy lazy-once 按需加载神器，但是lazy是每一个单独打包而lazyonce则是将所有异步模块打包在一起

// 此方案以被import()代替
require.ensure

var M = resolve => require.ensure([], () => resolve(require(['src'])), 'name')
```
