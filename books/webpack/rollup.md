menu  
[rollup核心](#rollup核心)  
[rollup配置说明](#rollup配置说明)  
[rollup使用](#rollup使用)  
[关于插件](#关于插件)  
[关于JS API](#关于jsapi)  
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
一、关于打包  
rollup有多种打包方式。  
1. 通过终端，使用rollup命令打包
2. 通过读取配置文件，使用rollup命名 rollup --config ./rollup.config.js
3. 通过node运行js文件，js文件中使用rollup提供的JSAPI完成

二、关于配置  
1）核心配置  
1. entry 指定入口文件
2. output 指定打包生成的文件
3. plugins 使用插件，如babel等
4. external 外部依赖
5. globals 全局模块

2）高级属性  
1. paths 第三方库对应的对象名与其路径，如$: '//jquery.min.js'
2. banner 打包后文件添加的banner
3. footer 打包后文件footer
4. intro/outro 包装器
5. cache 是否打包缓存（重新打包只需要更新缓存）
6. onwarn 警告处理
7. sourcemap
8. sourcemapFile
9. interop 是否添加'interop块'

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
一、核心配置  
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

## 关于插件

## 关于JSAPI
