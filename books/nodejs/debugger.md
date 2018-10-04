**目录**  
[nodejs调试简介](#nodejs调试简介)  
[CPU](#cpu)  
[内存](#内存)  
[工具](#工具)  
[其他](#其他)

# nodejs调试简介

## CPU

### 火焰图
### v8内置性能分析工具
> v8内置了性能分析工具 Tick Processor，可以记录js、c、c++代码堆栈信息，该功能默认是关闭的，通过`--prof`开启

如：
```js
// app.js
const crypto = require('crypto')
function hash (pwd) {
  const salt = crypto.randomBytes(128).toString('base64')
  return crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512')
}
console.time('test')
Array.apply(null, { length: 100 }).forEach(() => hash('huangzhong'))
console.timeEnd('test')
```

```sh
node --prof app.js
# test: 1090.789ms
```

我们会发现生成了一个log文件，可以通过`node --prof-process xx.log`来使用终端查看该log，也可以使用webUI.  
**WebUI**
```sh
# 生成log文件
node --prof xx.js
# 生成json文件
node --prof-process --preprocess xx.log > xx.json
# 借用第三方工具打开json文件，获得可视化结果
git clone  https://github.com/v8/v8.git

open v8/tools/proview/index.html
# 选择生成的json文件获得可视化结果
```

## 内存

## 工具

## 其他

### 关于loadtest使用
loadtest是一款基于node开发的web测试工具。[github](https://github.com/alexfernandez/loadtest)  

#### 常用指令

```sh
loadtest options url
```

| 参数名 | 说明 | 备注 |
|---|---|---|
| -n | 发起的请求数 | number |
| -c | 并发数 | number |
| --rps | qps即每秒发起的请求数 | number |
| -k | or --keepalive | |
| -C | cookie | loadtest -C name=value https://baidu.com |

具体参考`loadtest --help`或文档

### 关于火焰图
软件的性能分析，往往需要查看 CPU 耗时，了解瓶颈在哪里。火焰图就是通过对函数调用的记录来反映CPU使用情况。  
众所周知，nodejs是单线程异步IO模型，适合IO密集型场景，而CPU密集型一般是node的短板，所以读懂火焰图就显得很重要了。  

例如使用linux自带的pref，`perf record -F 99 -p 13204 -g -- sleep 30`，表示性能记录，频率为99HZ，pid为13204，记录调用栈，持续30秒。  
其实就是对调用栈进行快照，就像录像一样，如果调用栈很高，则证明不断进入子函数，调用栈很宽则表示该函数执行时间很长，但是父函数宽度一般是子函数造成的，所以看到函数很宽不代表函数本身有问题，而可能是其子函数性能较差。

#### 红蓝差分火焰图
我们在做性能分析或优化的时候，有时候很难判断优化是否有收益，红蓝差分火焰图就是用于对比优化前后的。大致原理是记录优化前后两次火焰图，并以第二张为基准通过红蓝色差来表示某个地方是正优化还是负优化。