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
