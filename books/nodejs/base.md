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
global __filename __dirname require Buffer module exports process 等全局变量

#### __filename __diname
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
2. 类似es6，export（类似接口）将方法与属性挂载在exports下 exports.say = function () {}

#### 访问主模块
在模块内require.main === module及main指向自己，因此被require就为false，通过这个原理我们入手一个应用可以很快找到一个入口文件
require.main.filename

#### 
