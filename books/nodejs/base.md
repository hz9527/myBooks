## 基础知识


### 交互运行环境REPL
其实就是类似与浏览器中控制台，能够直接在终端中运行js代码，并返回结果  
```JavaScript
192:~ hz$ node
> console.log(3)
3
undefined
>
```
在终端中输入node 然后enter就能进入REPL环境，操作两次ctrl＋c就能退出REPL  

> 或许说到这里你会觉得没什么用。请注意node是一种服务端语言，所有通过这个我们可以实现服务端编程，而不需要系统提供界面操作

一些指令
1. _ 上一个使用的变量
2. .break 退出一个正在编辑的函数
3. .save path (ex: .save ./test.js)将上下文输出作为一个文件
4. .load path 运行某个文件
5. .help
6. .clear
7. .exit

### console
在web前端开发中console非常常用，但我们也仅限于console.log，那么接下来介绍下node中的console
#### console占位符
除了console.dir其他console都可以log多个参数  
但是亲，你是否知道占位符？
```JavaScript
console.log('%d', 'hh') // NaN

console.log('im %s, im %d', 'huangzhong', 24) // im huangzhong, im 24
```
嗯，相信应该对占位符有所了解了吧？  
支持占位符（偷偷告诉你浏览器也支持,而且类型更多）
* %d number
* %s string
* %j json
* %% %不消耗占位符
```JavaScript
console.log('%%', 10) // % 10

console.log('%d%%', 10) // 10%
```

#### Console类
可以作为日志纪录
```JavaScript
const Console = require('console').Console // 其实是内置的，无需require
const fs = require('fs')
const outPut = fs.createWriteStream('./log.log')
const errPut = fs.createWriteStream('./err.log')
const log = new Console(outPut, errPut)
log.log(555)
log.error(333)
```
这样，我们就可以吧log，info写入log.log文件，error，warn写入err.log

#### console.log与console.info
两者使用基本一致
#### console.error与console.warn
两者使用基本一致

#### console.dir
第一个参数为log的对象，第二个为可选的options
```JavaScript
{
  showHidden: false, // 是否展示不可遍历属性与symbol属性，true则展示
  depth: 2, // 深度，默认2，及之后属性转为字符串 null则无限深度
  colors: false // 是否展示颜色，和终端支持有关，默认不展示
}
```
#### console.assert
console.assert(value[, message][, ...args])  
断言，如果第一个为true则不会输出，如果为false则将message作为一个error输出

#### console.time(label) console.timeEnd(label)
label会作为一个标识符，这也意味着timeEnd并不是返回时间戳而是与time的时间差

#### console.trace盏信息
打印当前盏信息，同样有一个标识符，以方便查看是在哪打印的


### timer定时器
和浏览器不同的是，node多了一种挂起定时器的方法，还有兼容性较差的immediate
1. setImmediate setTimeout setInterval
2. clearImmediate clearTimeout clearInterval
3. unref ref

immediate不需要时间参数，将会在本轮事件循环最后完成，当然，**发现timeout 0会比immediate先执行**  
unref会在事件循环结束后挂起定时器，与clear的区别在于，挂起意味着内存不会释放，直到它再次被调用  
ref则会唤醒被挂起的定时器，意味着1）未挂起的定时器不存在唤醒一说；2）不影响计时  
具体如下：
下面有三个定时器，会在一个事件循环里，如果挂起定时器在事件循环结束前就执行了那么，对不起，不接受这种挂起，如果在事件循环完成还没执行，那么就可以挂起了
```JavaScript
console.time('test')
var timer = setTimeout(() => {
  console.timeEnd('test')
}, 1500)
timer.unref() // can unref
var timer2 = setTimeout(() => {
  console.log(2)
}, 100)
timer2.unref() // can\t unref
setTimeout(() => {
}, 1000)
```
### 其他全局变量
除了上述的timer console外，node还提供了  
global \__filename \__dirname require Buffer module exports process 等全局变量

#### \__filename \__diname
两者返回结果都是绝对路径，严格来说这两货不是全局变量，是当前模块内置常量

```JavaScript
console.log(__filename, __dirname)
// /Users/**/**/myDemo/nodetest/filename.js /Users/**/**/myDemo/nodetest
```
#### exports module
详见module

### module
#### 导出模块有两种方式
1. module.exports = {}
2. 类似es6，export（类似接口）将方法与属性挂载在exports下 exports.say = function () {} (注：这种方式只能在模块内访问)

#### 访问主模块
在模块内require.main === module及main指向自己，因此被require就为false，通过这个原理我们入手一个应用可以很快找到一个入口文件
require.main.filename

#### 模块缓存
1）模块第一次被依赖后会缓存在全局的exports对象下，再次被依赖就直接取缓存  
试想这个场景，我们在导出一个mock接口，本来整个模块是动态的，但是当我们再次访问发现还是那样，因为已经将其返回（结果）缓存了  

2）模块的缓存是基于文件名（id）  
我们在不同文件中require同一个模块可能路径不同，node又是如何知道的呢？这得益于node缓存模块是以其绝对路径作为标识符，这也意味着在一些不区分字母大小写系统中可能存在问题，比如造成多次加载

#### 模块管理原理
1） 文件依赖  
1. 如果依赖（require内内容）以./ / ../ 开头，会根据路径查找
2. 如果依赖末端是一个文件则作为js（json node）加载
3. 如果依赖末端是不是一个文件则尝试将其作为文件，如果依旧未找到则将其转为目录查找，如果该目录下存在package中main指向再寻找index.js(json node)则加载该index

2） 目录依赖  
1. 如果依赖不以路径开头则会从当前路径下寻找node_modules中寻找，若为找到一直会找到跟目录的node_modules（当然对于核心模块或全局模块有相应优化）
3. 类似文件依赖，先作为文件加载，再作为目录加载，优先寻找其package中main指向

整个过程转为程序表达大致如下：
```
从 Y 路径的模块 require(X)
1. 如果 X 是一个核心模块，
   a. 返回核心模块
   b. 结束
2. 如果 X 是以 '/' 开头
   a. 设 Y 为文件系统根目录
3. 如果 X 是以 './' 或 '/' 或 '../' 开头
   a. 加载文件(Y + X)
   b. 加载目录(Y + X)
4. 加载Node模块(X, dirname(Y))
5. 抛出 "未找到"

加载文件(X)
1. 如果 X 是一个文件，加载 X 作为 JavaScript 文本。结束
2. 如果 X.js 是一个文件，加载 X.js 作为 JavaScript 文本。结束
3. 如果 X.json 是一个文件，解析 X.json 成一个 JavaScript 对象。结束
4. 如果 X.node 是一个文件，加载 X.node 作为二进制插件。结束

加载索引(X)
1. 如果 X/index.js 是一个文件，加载 X/index.js 作为 JavaScript 文本。结束
3. 如果 X/index.json  是一个文件，解析 X/index.json 成一个 JavaScript 对象。结束
4. 如果 X/index.node 是一个文件，加载 X/index.node 作为二进制插件。结束

加载目录(X)
1. 如果 X/package.json 是一个文件，
   a. 解析 X/package.json，查找 "main" 字段
   b. let M = X + (json main 字段)
   c. 加载文件(M)
   d. 加载索引(M)
2. 加载索引(X)

加载Node模块(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. 加载文件(DIR/X)
   b. 加载目录(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```
总结如下：
1. 核心模块
2. 作为路径加载
3. 作为模块加载

加载优先级如下：
1. 作为文件加载（js json node）
2. 加载目录－》package main －》 index

#### 模块管理技巧
1. 注意循环依赖中顺序
2. 导出需要同步，代码可以异步
3. 建议使用_而不是驼峰命名

如：模块a引用模块b，b模块也引用a，但是需要a加载完b才能执行，而index则同时引用了a，b。因此注意在index对a，b的引用顺序  
如：
```JavaScript
var a = {
  b: null
}
setTimeout(() => {
  a.b = 10
  module.exports = a // fail
}, 100)

module.exports = a // success
setTimeout(() => {
  a.b = 10
}, 100)
```

#### 模块底层原理
```JavaScript
(function (exports, require, module, __filename, __dirname) {
// 你的模块代码实际上在这里
});
```

#### 关于module对象
> 在每个模块中，module 的自由变量是一个指向表示当前模块的对象的引用。 为了方便，module.exports 也可以通过全局模块的 exports 对象访问。 module 实际上不是全局的，而是每个模块本地的。

1. module.children 被该模块引用的模块对象。
2. module.exports 对象是由模块系统创建的用于导出模块
3. module.filename 模块的完全解析后的文件名
4. module.id 模块的标识符。 通常是完全解析后的文件名
5. module.loaded 模块是否已经加载完成，或正在加载中。
6. module.parent 最先引用该模块的模块
7. module.require(id) 提供了一种类似 require() 从原始模块被调用的加载模块的方式
