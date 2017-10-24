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
1. entry 指定入口文件
2. output 指定打包生成的文件
3. plugins 使用插件，如babel等
4. external 外部依赖
5. globals 全局模块
6. banner 打包后文件添加的banner
7. footer 打包后文件footer
8. intro/outro 包装器
9. cache 是否打包缓存（重新打包只需要更新缓存）
10. onwarn 警告处理
11. sourcemap
12. sourcemapFile
13. interop
14. 
