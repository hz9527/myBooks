目录  
**插件**  
> \* 为webpack自带插件

[定义全局变量*](#defineplugin)  
[热加载*](#hotmodulereplacementplugin)  
[html模版](#htmlwebpackplugin)  
[限制包数量*](#limitchunkcountplugin)  
[分块打包*](#commonschunkplugin)  
[不打断进程*](#noemitonerrorsplugin)  
[热替换显示替换包名*](#namedmodulesplugin)  
[压缩js*](#uglifyjsplugin)  
[分离css](#extracttextplugin)  
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

### CommonsChunkPlugin
> 分模块打包的好处是一次加载多次使用，方式是将业务代码与依赖代码分开，通过`manifest`管理。然而绝大部分场景却变成了将业务代码与依赖分开
个人认为应该将公用的第三方库代码打完并缓存到用户端本地，`manifest`及业务代码每次请求新的，或者打四个包`commonVendor` `vendor` `manifest` `app`

如何实现（将依赖与业务代码分开）
```JavaScript
{
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module, counts) { // module {context, resource}
        return (
          module.resource && /\.js$/.test(module.resource) &&
          module.resource.indexOf('node_modules') > -1)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app', // 对应入口名entry: {app: './src/index.js'}
      async: 'vendor-async',
      minChunks: 3,
      children: true
    })
  ]
}
```

关于按需加载，默认会根据其顺序下标作为name  
```JavaScript
var Test = () => import(/* webpackChunkName: "xx" */'vue')
```

### NoEmitOnErrorsPlugin
> 如果使用cli启动webpack会存在一个问题，当编译错误会使得webpack退出进程，使用此插件可以保持webpack不主动退出

`new webpack.NoEmitOnErrorsPlugin()`

### NamedModulesPlugin
> 我们有时候并不满足于热替换，还希望热替换时能显示替换了什么

`new webpack.NamedModulesPlugin()`

### UglifyJsPlugin
> 压缩js使用，但是对于es6+的代码treesharking支持并不好（不代表不支持）

`new webpack.optimize.UglifyJsPlugin()`

### ExtractTextPlugin
> 将`css`放置在`js`中最大的坏处是`js`加载完后`css`才能被加载，这也就意味着要么将`js`放置在`head`中阻塞`dom`加载要么把`css`分离出来
这个插件就会将`chunk`中依赖的`css`文件单独拎出来

但是如果是异步加载的`chunk`呢？嗯，这个插件很笨，默认`allChunks`为`true`意味着所有`css`都会被提起出来，因此设置为`false`即可  
此外还需要用此插件在`cssLoader`里做一下手脚，它才知道哪些是需要被提取出来的
