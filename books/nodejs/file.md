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
1. fs.ReadStream类
2. fs.WriteStream类
3. fs.Stats类
4. fs.FSWatcher类

|api                                                                                     | 作用                                             ｜
|----------------------------------------------------------------------------------------|--------------------------------------------------|
|fs.access(path[, mode], callBack) fs.accessSync(path[, mode], callBack)                 |指定目录或文件权限（具体通过made决定）                 |
|fs.constants                                                                            |返回一个包含常用文件系统操作的常量的对象                |
|fs.existsSync(path)                                                                     |判断某个路径或文件是否存在                            |
|fs.open(path,flags[,options],callBack) fs.openSync(path,flags[,options])                |打开文件                                          |
|fs.close(fd, callBack) fs.closeSync(fd)                                                 |关闭文件                                           |
|fs.link(existingPath,newPath,callBack) fs.linkSync(existingPath,newPath)                |建立文件硬连接（符号链接）                           |
|fs.symlink(target,path[,type],callBack) fs.symlinkSync(target,path[,type])              |创建符号链接                                       |
|fs.unlink(path,callBack) fs.unlinkSync(path)                                            |取消符号链接                                       |
|fs.readlink(path[,options],callBack) fs.readlinkSync(path[,options])                    |返回符号链接的字符串值                              |
|fs.read(fd,buffer,offset,length,position,callBack) fs.readSync                          |从 fd 指定的文件中读取数据                          |
|fs.readdir(path[,options],callBack) fs.readdirSync(path[,options])                      |读取一个目录的内容                                 |
|fs.readFile(file[,options],callBack) fs.readFileSync(file[,options])                    |读取一个文件的全部内容                              |
|fs.realpath(path[,options],callBack) fs.realpathSync(path[,options])                    |获取文件或目录绝对路径                              |
|fs.rename(oldPath, newPath, callBack) fs.renameSync(oldPath,newPath)                    |重命名文件及路径                                   |
|fs.rmdir(path,callBack) fs.rmdirSync(path)                                              |删除目录                                          |
|fs.mkdir(path[,mode],callBack) fs.mkdirSync(path[,mode])                                |创建文件夹                                        |
|fs.mkdtemp(prefix[,options],callBack) fs.mkdtempSync(prefix[,options])                  |创建一个唯一的临时目录                              |
|fs.createReadStream(path[,options])                                                     |返回一个新建的 ReadStream 对象（可读流）              |
|fs.createWriteStream(path[,options])                                                    |返回一个新建的 ReadStream 对象（可写流）              |
|fs.appendFile(file,data[, options], callBack) fs.appendFileSync(file,data[, options])   |向指定文件添加内容                                   |
|fs.ftruncate(fd,len,callBack) fs.ftruncateSync(fd,len)                                  |截断文件                                          |
|fs.truncate(path,len,callBack) fs.truncateSync(path,len)                                |截断文件                                          |
|fs.write fs.writeSync 4                                                                 |写入 buffer 到 fd 指定的文件                       |
|fs.writeFile(file,data[,options],callBack) fs.writeFileSync(file,data[,options])        |写入数据到文件，如果文件已经存在，则替代文件            |
|fs.stat(path,callBack) fs.statSync(path)                                                |查看文件信息                                       |
|fs.fstat(fd,callBack) fs.fstatSync(fd)                                                  |在文件open情况下查看文件信息                         |
|fs.lstat(path,callBack) fs.lstatSync(path)                                              |查看文件信息                                       |
|fs.fdatasync(fd,callBack) fs.fdatesyncSync(fd)                                          |文件写入硬盘                                       |
|fs.fsync(fd,callBack) fs.fsyncSync(fd)                                                  |文件写入硬盘                                       |
|fs.chomd(path,mode,callBack) fs.chomdSync(path, mode)                                   |修改文件读写权限                                    |
|fs.fchomd(fd,mode,callBack) fs.fchomdSync(fd,mode)                                      |在文件open情况下更改文件权限                         |
|fs.lchome(path,mode,callBack) fs.lchomdSync(path,mode)                                  |修改文件读写权限                                    |
|fs.chown(path,uid,gid,callBack) fs.chown(path,uid,gid)                                  |修改文件所有权。                                    |
|fs.fchown(fd,uid,gid,callBack) fs.fchownSync(fd,uid,gid)                                |在文件open情况下更改文件所有权                        |
|fs.lchown(path,uid,gid,callBack) fs.lchownSync(path,uid,gid)                            |修改文件所有权                                     |
|fs.futimes(fd, atime, mtime,callBack) fs.futimesSync(fd,atime,mtime)                    |修改文件访问时间及修改时间                           |
|fs.unwatchFile(filename[,listener])                                                     |取消watch                                         |
|fs.utimes(path,atime,mtime,callBack) fs.utimesSync(path,atime,mtime)                    |修改文件访问时间及修改时间                           |
|fs.watch(filename[,options][,listener])                                                 |watch文件或目录                                    |
|fs.watchFile(filename[,options],listener)                                               |watch一个文件                                      |

#### 读文件

#### 写文件
1.追加数据到一个文件  
如果文件不存在会自动创建  
fs.appendFile(file, data[, options], callBack) fs.appendFileSync(file, data[, options])  
* file <String> | <Buffer> | <Number> 文件名或文件描述符
* data <String> | <Buffer>
* options <Object> | <String>
  * encoding <String> | <Null> 默认 = 'utf8'
  * mode <Integer> 默认 = 0o666
  * flag <String> 默认 = 'a'

> 如果options只是字符串默认为指定encoding，如果file为文件，则该文件不会自动关闭

#### 文件信息
#### 文件操作
#### 其他
1.文件或目录权限  
fs.access(path[, mode], callBack) fs.accessSync(path[, mode])
* fs.constants.F_OK - path 文件对调用进程可见。 这在确定文件是否存在时很有用，但不涉及 rwx 权限。 如果没指定 mode，则默认为该值。
* fs.constants.R_OK - path 文件可被调用进程读取。
* fs.constants.W_OK - path 文件可被调用进程写入。
* fs.constants.X_OK - path 文件可被调用进程执行。 对 Windows 系统没作用（相当于 fs.constants.F_OK）

在读写文件没必要先判断其权限，如此处理会造成紊乱情况，因为其他进程可能在两个调用之间改变该文件的状态。 作为替代，用户代码应该直接打开/读取/写入文件，当文件无法访问时再处理错误。
```JavaScript
// 不推荐
fs.access('myfile', (err) => {
  if (!err) {
    console.error('myfile already exists');
    return;
  }
  fs.open('myfile', 'wx', (err, fd) => {
    if (err) throw err;
    writeMyData(fd);
  });
});

// 推荐
fs.open('myfile', 'wx', (err, fd) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.error('myfile already exists');
      return;
    }
    throw err;
  }
  writeMyData(fd);
});
```


### Buffer
> 在 ECMAScript 2015 (ES6) 引入 TypedArray 之前，JavaScript 语言没有读取或操作二进制数据流的机制。 Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流。
TypedArray 现已被添加进 ES6 中，Buffer 类以一种更优化、更适合 Node.js 用例的方式实现了 Uint8Array API。

#### Buffer特点
1. 实例类似数组
2. 大小固定，在V8堆外分配内存
3. 创建时确定其大小，且不可更改
4. 在node中是全局变量，因此无需require

#### Buffer创建
1. Buffer.from
2. Buffer.alloc
3. Buffer.allocUnsafe
> 在node v6前是使用new Buffer创建，现已废弃

#### Buffer与字符编码
Buffer支持 ascii utf8 utf16le（ucs2） base64 latin1（binary） hex

#### Buffer实例与ES6迭代器
支持 for of  keys values entries迭代器


### Stream

### path

### fileReader
上面主要是node关于文件的一些内容，接下来看看浏览器提供的fileReader用于读取文件  
> FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。  

我们知道使用input（type file）并不能直接获取到文件路径来引用。试想这个场景： 用户通过input选择了一张图片，我们如何将这张图片给用户编辑？  
1）将文件上传至服务器，然后从服务器取得文件路径，然后给用户编辑，显然这种方法很傻，一方面浪费网络资源另一方面需要等待  
2）将本地文件转成二进制流活着base64直接使用canvas或者images  
那么让我们来学习一下fileReader吧  
需要了解几个概念  
1. 文件格式
2. 读取状态
3. 读取格式
4. 事件
需要将需要读取的file或blob交给fileReader读取；在读取过程中会有0，1，2（EMPTY，LOADING，DONE）三种状态；  
可以以四种文件读取为四种格式readAsArrayBuffer，readAsBinaryString，readAsDataURL，readAsText；  
既然是一种异步方法，那么就像ajax一样会提供相应事件1）onabort2）onerror3）onload4）onloadend5）onloadstart6）onprogress

使用教程：
1. 实例化fileReader
2. 执行读取方法
3. 监听事件

举个 :chestnut:
```JavaScript
var file = document.getElementById('input').files[0]
var reader = new FileReader()
reader.readAsDataURL(file)
reader.onprogress(e) = function (e) {
  console.log(e) // progress info
}
reader.onloadend = function () {
  console.log(this)
  // {
  //   result: xxx,
  //   error: null,
  //   readyState: 2,
  //   onloadstart ... // 绑定的事件
  // }
}
```
如果执行onabort会直接中断文件读取并将readyState置为2  
可以配合input，canvas，video等使用，将读取结果作为video.src就好
