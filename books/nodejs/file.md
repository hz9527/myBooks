## 数据流与文件系统
目录：
[文件系统](#文件系统)  
[Buffer](#buffer)  
[Stream](#stream)  
[path](#path)  
[fileReader](#filereader)  


### 文件系统
文件 I/O 是由简单封装的标准 POSIX 函数提供的。 通过 require('fs') 使用该模块。   
**所有的方法都有异步和同步的形式**  
这将意味着
1. 整个api基本都有同步和异步方法
2. 建议使用异步方法，因为不阻塞
3. 同步方法带Sync
4. 和ajax一样异步意为返回顺序不一定

将从读写文件，文件信息，文件操作，其他五个方面来介绍fs核心模块  
官方文档中分了四个类
1. fs.ReafStream类
2. fs.WriteStream类
3. fs.Stats类
4. fs.FSWatcher类
#### 读文件

#### 写文件
#### 文件信息
#### 文件操作
#### 其他

### Buffer

### Stream

### path

### fileReader
