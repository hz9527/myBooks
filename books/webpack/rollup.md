menu  
[rollup核心](#rollup核心)  
[rollup配置说明](#rollup配置说明)  
[rollup使用](#rollup使用)  
[关于插件](#关于插件)  
[关于JS API](#关于jsapi)  
[其他](#其他)  

## rollup核心
rollup也是用于打包项目使用的，总体来说十分适合给小项目打包如，插件，库，甚至框架，其上手更为简单，打包速度更快，甚至打包后体积更小

## rollup配置说明
与webpack一致，rollup打包主要配置选项包括，入口，输出，插件，热更新等  
```js
export default {
  entry: file,
  output: {
    file: file,
    name: moduleName,
    format: cjs
  },
  plugins: [resolve()],
  watch: {
    include: './src/**'
  }
}
```

## rollup使用
**一、关于打包**  
rollup有多种打包方式。  
1. 通过终端，使用rollup命令打包
2. 通过读取配置文件，使用rollup命名 rollup --config ./rollup.config.js
3. 通过node运行js文件，js文件中使用rollup提供的JSAPI完成

**二、关于配置**  
1）核心配置  
1. entry 指定入口文件
2. output 指定打包生成的文件
3. plugins 使用插件，如babel等
4. external 外部依赖
5. globals 全局模块

2）高级属性  
1. paths 第三方库对应的对象名与其路径，如$: '//jquery.min.js'
2. banner／footer 打包后文件添加的banner及footer
3. intro/outro 包装器
4. cache 是否打包缓存（重新打包只需要更新缓存）
5. onwarn 警告处理
6. sourcemap
7. sourcemapFile
8. interop 是否添加'interop块'

3）特殊属性  
1. treeshake
2. acorn
3. context
4. moduleContext
5. legacy
6. exports
7. amd
8. indent
9. strict

4）热更新  
1. watch

## rollup配置项
**一、核心配置**  
1.entry String  
如 entry: 'main.js'  

2.output Object  
```javaScript
{
  output: {
    file: './dest/index.js',
    format: 'iife',
    name: 'myModule'
  }
}
```
> 注：format为枚举字符串，iife cjs umd es amd
name为模块名，当format为模块化时这个是必须的，如果是iife，也可以使用模块名访问其返回

3.plugins Array  
[关于插件](#关于插件)  

4.external Function or Array  
如果是Function会传入id，返回true或false，如果是数组则为id列表  
id为外部依赖名称或其绝对路径  

5.globals Object  
与external一致，id：name  
```javaScript
{
  globals: {
    jquery: '$'
  }
}
```

****

**二、高级属性**  
1.paths 为output属性 Function or Object

```javaScript
{
  external: ['jquery'],
  output: {
    file: 'index.js',
    name: 'myBundle',
    format: 'cjs',
    paths: {
      jquery: '//jquery.min.js'
    }
  },
  globals: {
    jquery: '$'
  }
}
```

2.banner/footer String  
添加在打包后文件字符串
```js
'/* my-library version ' + version + ' */' // 记得加注释符号
```  

3.intro/outro String  
类似与banner与footer，不过是代码而不是注释了  

4.cache Object  
其实就是缓存的包，因此在js Api使用比较好，将bundles赋值给cache即可  

5.onwarn Function  
用于拦截警告，如忽略一些警告，参数为warning对象，warning对象有code message 属性，部分还有loc frame属性  

6.sourceMap Boolean or String  
如果为true则生产sourceMap文件，如果问inline则可以定位output代码位置  

7.sourceMapFile String  
生成sourceMap文件位置  

8.interop Boolean  
默认为true，主要是用于区分导出接口与默认模块的区别，及export 与export default，如果没必要使用默认值即可  

****

**三、特殊属性**  
1.treeshake Boolean
是否使用tree-shaking，基本无需配置，除非因其导致bug  

2.acorn  

3.context  
默认上下文，this指向，默认为undefined，如可以改为'window'  

4.moduleContext 类似context  

5.legacy  

6.exports String  
默认为auto，值还可以为default named none  

7.amd  

8.indent Boolean  
是否缩进，默认true  

9.strict Boolean  
是否使用严格模式，默认true  

****

**四、热更新**  
1.watch  Object  
watch有以下配置项：
1. chokidar Boolean 是否使用chokidar来watch（true的前提是引入了chokidar）否则为fs.watch
2. include
3. exclude

## 关于插件

## 关于JSAPI  
学习完rollup.config.js配置项后对于js API应该大致能有一定概念。核心思路是rollup提供类似打包（输入）指令，输出指令，及watch API  
**一、接口**  
1.rollup.rollup  
参数为inputOptions，返回一个 Promise，它解析了一个 bundle 对象  
bundle对象具有如write generate等方法  

2.bundle对象  
write generate方法参数为outputOptions，generate方法返回一个对象，有code及map两个属性  

3.rollup.watch  
参数为watchOptions，返回一个watcher实例，监听event事件  
```JavaScript
const rollup = require('rollup')
const watchOptions = {...}
let watcher = rollup.watch(watchOptions)
watch.on('event', event => {
  // event.code 可能为以下值：
  // START 启动或重启
  // BUNDLE_START 构建开始
  // BUNDLE_END 构建结束
  // END 全部构建完成
  // ERROR 报错
  // FATAL 阻塞中断
})
```
实例还有close方法，结束监听

**二、配置**  
```JavaScript
// 1.inputOptions
{
  // 核心参数
  input, // 唯一必填参数
  external,
  plugins,
  // 高级参数
  onwarn,
  cache,
  // 特殊属性
  acorn,
  context,
  moduleContext,
  legacy
}
// 2.outputOptions
{
  // 核心参数
  file,   // 若有bundle.write，必填
  format, // 必填
  name,
  globals,

  // 高级参数
  paths,
  banner,
  footer,
  intro,
  outro,
  sourcemap,
  sourcemapFile,
  interop,

  // 特殊属性
  exports,
  amd,
  indent
  strict
}
// 3.watchOptions
{
  ...inputOptions,
  output: [outputOptions],
  watch: {
    chokidar,
    include,
    exclude
  }
}
```

## 其他
**一、关于npm依赖**  
其实rollup没有webpack那么智能，当我们import一个npm包时rollup并不能处理，需要使用rollup-plugin-node-resolve插件来处理
```JavaScript
let rollup = require('rollup')
let resolve = require('rollup-plugin-node-resolve')

const inputOptions = {
  ...
  plugins: [resolve()]
}
```

另外，我们在npm上引用的很多包是按照CommonJS标准打包的，但是我们更希望它是ES6模块，因此可以使用rollup-plugin-commonjs插件将其转化
> 注，因为该插件会去检测并重新输入es模块，因此需要在其他插件使用前使用该插件，即在plugins数组中放在第一个

**二、外部依赖**  
试想以下场景，如我们单独打包一些通用组件或库，然而它们可能同时依赖一些插件或库，如果把这些依赖都打包进去那么意味着我们单独打包的通用组件或库将拥有大量臃余代码（同时依赖的那些插件或库）  
因此虽然我们有时候import了依赖但并不意味着我们希望在打包后的代码中加入它们，这就是外部依赖，在配置项中我们见识了external，那么具体如何使用呢？  
```JavaScript
// main.js
import a from 'a'
import b from 'b' // 外部依赖
export default {
  c: a + b
}

// config
const resolve = require('rollup-plugin-node-resolve')

module.exports = {
  ...
  pulgins: [
    resolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    })
  ],
  external: ['b']
}
```

**三、Babel集成**  
