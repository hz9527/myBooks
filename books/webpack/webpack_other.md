目录  
**插件**  
> \* 为webpack自带插件

[定义全局变量*](#defineplugin)  
[热加载*](#hotmodulereplacementplugin)  
[html模版](#htmlwebpackplugin)  
[限制包数量*](#limitchunkcountplugin)  
[限制包数量*](#limitchunkcountplugin)  
**loader**  

### DefinePlugin
> 本插件用于定义一些全局变量或者一些全局代码片段，这个插件是webpack自带的

例如，我们希望一些代码只有在开发环境或线上环境出现，可以通过一些全局变量来实现，在代码压缩后甚至可以增加或删除这一部分代码
```JavaScript
// config.js
var env = process.argv[2] === 'test' ? 'test' : 'prod'
{
  // ...
  plugins: [
    new webpack.DefinePlugin({
      ENV: `'${env}'`
    })
  ]
}

// app.js
if (ENV === 'test') {
  console.log(ENV)
}
if (ENV === 'prod') {
  console.log(123)
}

// bundle.js
if (true) {
  console.log('test')
}
if (false) {
  console.log(123)
}

// bundle.min.js
console.log('test')
```

**注：**  
1. 值会被当作字符串传入，如`ENV: 'test'`,那么全局变量是一个变量名`test`而不是`test字符串`，因此需要两层引号，也可以使用`JSON.stringify('test')`实现
2. 可以传入一个函数甚至对象

```JavaScript
{
  // ...
  plugins: [
    new webpack.DefinePlugin({
      IIFE: function () {console.log(1)}
    })
  ]
}

// app.js
console.log(IIFE)

// bundle.js
console.log(function () {console.log(1)})
```

### HotModuleReplacementPlugin
> 这个插件表示使用热加载，目前虽然有一些配置项，但可能会变化，所以直接用就好，嗯，也是webpack自带的，别忘了dev用就好

`new webpack.HotModuleReplacementPlugin()`

### HtmlWebpackPlugin
> 这个插件为我们提供html模版，供webpack使用

我们希望webpack打包完成后自动将打包完成的页面注入到入口html中，这就是这个插件能为我们做的事情之一，当然这是一个第三方插件  
我们可以不需要在根目录中写一个html，完全使用本插件完成简单html的生成，当然建议还是提供一个模版，来注入包即可  
除此之外甚至还可以压缩代码，添加额外的chunk，chunks排序等  
[doc](https://github.com/jantimon/html-webpack-plugin#configuration)  
```JavaScript
// options
{
  filename: 'index.html', // path.join(__dirname, '../dist/index.html')
  template: path.join(__dirname, '../index.html'),
  inject: true, // true 'head' 'body'
  chunksSortMode: 'dependency'
}
```

### LimitChunkCountPlugin
> 按需加载在一定程度上可以优化代码，但如果过多的按需加载或者说粒度过小的按需加载会导致一个问题，分离包太小，一个额外http请求的开销甚至比不分离这个包的开销大，那么有必要限制每个包的大小

本插件配置也很简单  
> 在合并 chunk 时，webpack 会尝试识别出具有重复模块的 chunk，并优先进行合并。任何模块都不会被合并到 entry chunk 中，以免影响初始页面加载时间

```JavaScript
{
  // ...
  plugins: [
    new webpack.optimize.LimitChunksCountPlugin({
      maxChunks: 5,
      minChunkSize: 100
    })
  ]
}
```
