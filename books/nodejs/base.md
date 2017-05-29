## 基础知识
目录：
[交互运行环境REPL](#交互运行环境REPL)  
[console](#console)  
[timer定时器](#timer定时器)  
[其他全局变量](#其他全局变量)  
[module](#module)  
[事件循环机制](#事件循环机制)  
[调试](#调试)  

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

### 事件循环机制
我们知道node最大特点是非阻塞IO，而之所以能实现，依赖于node提供的事件循环（libuv层），而事件循环主要依赖于异步和事件监听  
咋一看我们会认为事件是同步的，因为触发了就马上同步执行监听函数，其实不然。试想以下两种场景  
1）浏览器  
此时js脚本正在处理一些东西，而此时我点击了某个监听了click事件的dom，那么这个click回调是立即执行吗？  
显然不是，这个回调会被放到一个队列中（task或者microTask）直到执行栈空了就会去执行这个队列  
2）node  
此时js正在处理一些东西，此时有一个用户发送了一个请求。那么node会直接退出当前执行而直接去响应这个请求吗？  
显然不是  
3）自定义订阅发布  
好吧，我承认一旦task执行了，事件回调会被同步执行，自定义订阅发布也是这样，一旦发布会同步执行订阅函数，从一定角度来说自定义的订阅发布和原生事件是有本质区别的  
因为自定义订阅发布不会被塞到一个task去等待，而是立即执行，当然自定义订阅发布也没有这个能力
> 显然，nodejs的事件并不是自定义的订阅发布，否则事件就没有意义了，因为我们希望的事件具备被放置在task中等待当前执行完毕再塞入执行栈的能力  

#### node中事件模块
node中提供的这种会被塞到task事件全部继承于events核心模块  
```JavaScript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('发生了一个事件！');
});
myEmitter.emit('event');
```
#### events添加监听
1. on
2. once
3. addListener
```JavaScript
var EventEmitter = reuire('events')
class MyEmitter extends EventEmitter {}
myEmitter = new MyEmitter()

myEmitter.on(eventName, callBack)
myEmitter.once(eventName, callBack)
myEmitter.addListener(eventName, callBack)
```

#### events主动触发事件
```JavaScript
...
myEmitter.emit(eventName, arg) // 和vue很像
```

#### events错误事件处理
我们直到node是单线程，这个其实有一个很大的问题，一旦代码在某个地方报错就可能阻塞并退出进程，所以这需要开发者将代码组织得足够健壮使得这种阻塞降到最低  
> 当 EventEmitter 实例中发生错误时，会触发一个 'error' 事件。 这在 Node.js 中是特殊情况。
如果 EventEmitter 没有为 'error' 事件注册至少一个监听器，则当 'error' 事件触发时，会抛出错误、打印堆栈跟踪、且退出 Node.js 进程。
为了防止 Node.js 进程崩溃，可以在 process 对象的 uncaughtException 事件上注册监听器，或使用 domain 模块。 （注意，domain 模块已被废弃）

所以我们还可以为进程注册一个uncaughtException事件监听，以防止阻塞产生
```JavaScript
...
const myEmitter = new MyEmitter();
process.on('uncaughtException', (err) => {
  console.error('有错误');
});
myEmitter.emit('error', new Error('whoops!')); // 打印: 有错误
```

#### events事件
这是个啥？  
试想，假如我们绑定一个事件或者解绑一个事件是不是应该告诉我们一声？  
对，events核心模块就是这么强，给我提供了绑定与解绑事件  
**node 为我们提供了newListener 与 removeListener事件来监听事件绑定与移除** 参数都是eventName listener（callBack）
```JavaScript
const myEmitter = new MyEmitter();
// 只处理一次，所以不会无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在开头插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```

#### events移除监听
我想你大概已经知道怎么移除事件了
1. myEmitter.removeListener(eventName, listener)
2. myEmitter.removeAllListeners([eventName]) 没有参数表示移除所有事件的所有监听

#### 事件实例的其他方法
我们刚刚讲到事件添加，移除监听的方法，其实events模块给我提供的实例方法远不止这些  
1. emitter.eventNames()
  * 返回事件管理实例监听的所有事件名数组，如[ 'foo', 'bar', Symbol(symbol) ]
2. emitter.getMaxListeners()
  * 返回事件管理实例监听器最大数量（为了防止内存溢出，开发者需要尽量减少不必要的监听器）
3. emitter.listenerCount(eventName)
  * 返回事件管理实例某个事件的监听函数数量
4. emitter.listeners(eventName)
  * 返回事件管理实例某个事件的监听函数组成的数组
5. emitter.setMaxListeners(n)
  * 设置事件管理实例能监听的函数数量，默认为10
6. emitter.prependListener(eventName, listener)
  * 将事件添加到事件的第一个（正常添加监听是最后执行，这样添加将第一个执行），注，这种添加方式不会检查该listener是否已经添加过，也就意味着一个listener可能执行多次
7. emitter.prependOnceListener(eventName, listener)
  * 看上面，自己体会吧。对了，参数列表不再有emit提供，而是事件管理实例

```JavaScript
...
myEmitter.prependListener('test', (stream) => {
})
```
EventEmitter.defaultMaxListeners你懂的

### 调试
node调试不比浏览器，原声的调试方法主要是通过命令行，当然随着ide的强大，也有ide具有调试js的能力  
#### 原生调试
使用命令行在终端中输入debug file  
流程控制  
1. c 继续执行
2. n 下一步
3. step（s）跳进函数
4. out（o）跳出函数
5. pause暂停

命令行断点
1. setBreakpoint(), sb() - 在当前行设置断点
2. setBreakpoint(line), sb(line) - 在指定行设置断点
3. setBreakpoint('fn()'), sb(...) - 在函数体的第一条语句设置断点
4. setBreakpoint('script.js', 1), sb(...) - 在 script.js 的第 1 行设置断点
5. clearBreakpoint('script.js', 1), cb(...) - 清除 script.js 第 1 行的断点

信息
1. backtrace, bt - 打印当前执行框架的回溯
2. list(5) - 列出脚本源代码的 5 行上下文（前后各 5 行）
3. watch(expr) - 添加表达式到监视列表
4. unwatch(expr) - 从监视列表移除表达式
5. watchers - 列出所有监视器和它们的值（每个断点会自动列出）
6. repl - 打开调试器的 repl，用于在所调试的脚本的上下文中进行执行
7. exec expr - 在所调试的脚本的上下文中执行一个表达式

执行控制
1. run - 运行脚本（调试器开始时自动运行）
2. restart - 重新启动脚本
3. kill - 终止脚本

其他
1. scripts - 列出所有已加载的脚本
2. version - 显示 V8 引擎的版本号

调试时可以在代码中加入debugger

具体还是在实践中积累吧，另外建议可以使用debugger工具，如ide自带与node-inspector调试工具
