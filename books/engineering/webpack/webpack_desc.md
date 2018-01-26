目录  
[综述](#综述)  
[入口](#入口)  
[出口](#出口)  
[loader](#loader)  
[插件](#插件)  
[其他](#其他)  

### 综述
webpack看起来很复杂，然而其核心概念仅仅只有4个：entry入口 output出口 loader加载器 plugins插件

#### 入口综述
entry是告诉webpack依赖的起点，那么webpack将基于起点将所有依赖关系进行bundle，入口既可是单个入口也可以多个入口

#### 出口综述
output是告诉webpack打包后的文件叫啥，放在哪，值为对象，至少配置path，filename两个属性

#### loader
我们知道webpack强大到几乎可以打包任何文件，如.scss .vue .ts等等，但其实webpack只认识js，之所以能认识它们是因为loader将其转化成webpack能认识的模块和js。值为对象数组，每个对象具备test，use属性

#### 插件综述
知道了loader后我们会发现loader只能完成将webpack不认识的文件转化成webpack认识的模块，但是这个并不够，比如我们希望在转译完成后搞一些事，例如加一个banner，那么此时就可以使用插件了，插件能利用webpack的一些钩子对打包的代码实现一些定制化的功能，值为数组，每一项为插件实例

****

### 入口
1. 值为String或Object
2. 路径为根目录（packag.json目录下）相对路径
3. 当为String时name默认为main，如果为对象name为定义的name

```js
{
  entry: './src/main.js'
}

{
  entry: {
    main: './src/main.js'
  }
}
```

### 出口
出口对应着入口，并提供了相关占位符：name hash chunkhash id query等  
正常情况下出口对应着入口，即入口如何定义出口就如何输出，但为啥我们平时开发时会打包生成vendor.js app.js manifest.js呢？是因为使用了相关插件使之分开了  
vendor主要是将第三方依赖打包在一起了，manifest则是实现依赖关系，app.js则是开发的代码  

**关于publicPath**  
如果打包的文件统一托管在前端cdn上而index.html托管在后端服务器上，那么打包时不论是图片还是按需加载的代码块都会因为相对路径问题而404，因此publicPath就能解决这个问题  

```js
{
  output: {
    path: path.resolve(__dirname, '../dest'),
    filename: '[name]_[chunkhash:10].js',
    publicPath: '//static.baidu.com/assets/project/js/[name]_[chunkhash:10].js'
  }
}
```

### loader
loader主要需要指定哪些文件需要转译，什么时候转，用什么转，当然还有其他的一些功能

```js
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  }
}

{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      }
    ]
  }
}

{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
    ]
  }
}
```

### 插件

### 其他
