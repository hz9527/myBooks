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

|api                                                                                     | 作用                                             ｜
|----------------------------------------------------------------------------------------|--------------------------------------------------|
|fs.access(path[, mode], callBack) fs.accessSync(path[, mode], callBack)                 |        |
|fs.appendFile(file,data[, options], callBack) fs.appendFileSync(file,data[, options])   |         |
|fs.chomd(path,mode,callBack) fs.chomdSync(path, mode)                                   |        |
|fs.chown(path,uid,gid,callBack) fs.chown(path,uid,gid)                                  |        |
|fs.close(fd, callBack) fs.closeSync(fd)                                                 |        |
|fs.constants                                                                            |        |
|fs.createReadStream(path[,options])                                                     |        |
|fs.createWriteStream(path[,options])                                                    |        |
|fs.existsSync(path)                                                                     |        |
|fs.fchomd(fd,mode,callBack) fs.fchomdSync(fd,mode)                                      |        |
|fs.fchown(fd,uid,gid,callBack) fs.fchownSync(fd,uid,gid)                                |        |
|fs.fdatasync(fd,callBack) fs.fdatesyncSync(fd)                                          |        |
|fs.fstat(fd,callBack) fs.fstatSync(fd)                                                  |        |
|fs.fsync(fd,callBack) fs.fsyncSync(fd)                                                  |        |
|fs.ftruncate(fd,len,callBack) fs.ftruncateSync(fd,len)                                  |        |
|fs.futimes(fd, atime, mtime,callBack) fs.futimesSync(fd,atime,mtime)                    |        |
|fs.lchome(path,mode,callBack) fs.lchomdSync(path,mode)                                  |        |
|fs.lchown(path,uid,gid,callBack) fs.lchownSync(path,uid,gid)                            |        |
|fs.link(existingPath,newPath,callBack) fs.linkSync(existingPath,newPath)                |        |
|fs.lstat(path,callBack) fs.lstatSync(path)                                              |        |
|fs.mkdir(path[,mode],callBack) fs.mkdirSync(path[,mode])                                |        |
|fs.mkdtemp(prefix[,options],callBack) fs.mkdtempSync(prefix[,options])                  |        |
|fs.open(path,flags[,options],callBack) fs.openSync(path,flags[,options])                |        |
|fs.read(fd,buffer,offset,length,position,callBack) fs.readSync                          |        |
|fs.readdir(path[,options],callBack) fs.readdirSync(path[,options])                      |        |
|fs.readFile(file[,options],callBack) fs.readFileSync(file[,options])                    |        |
|fs.readlink(path[,options],callBack) fs.readlinkSync(path[,options])                    |        |
|fs.realpath(path[,options],callBack) fs.realpathSync(path[,options])                    |        |
|fs.rename(oldPath, newPath, callBack) fs.renameSync(oldPath,newPath)                    |        |
|fs.rmdir(path,callBack) fs.rmdirSync(path)                                              |        |
|fs.stat(path,callBack) fs.statSync(path)                                                |        |
|fs.symlink(target,path[,type],callBack) fs.symlinkSync(target,path[,type])              |        |
|fs.truncate(path,len,callBack) fs.truncateSync(path,len)                                |        |
|fs.unlink(path,callBack) fs.unlinkSync(path)                                            |        |
|fs.unwatchFile(filename[,listener])                                                     |        |
|fs.utimes(path,atime,mtime,callBack) fs.utimesSync(path,atime,mtime)                    |        |
|fs.watch(filename[,options][,listener])                                                 |        |
|fs.watchFile(filename[,options],listener)                                               |        |
|fs.write fs.writeSync 4                                                                 |        |
|fs.writeFile(file,data[,options],callBack) fs.writeFileSync(file,data[,options])        |        |
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

### Stream

### path

### fileReader
