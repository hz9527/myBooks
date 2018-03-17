## webkit
目录  
[浏览器和浏览器内核](#浏览器和浏览器内核)  
[HTML网页和结构](#html网页和结构)  
[Webkit架构和模块](#webkit架构和模块)  
[资源加载和网络栈](#资源加载和网络栈)  
[HTML解释器和DOM模型](#html解释器和dom模型)  
[CSS解释器和样式布局](#css解释器和样式布局)  
[渲染基础](#渲染基础)  
[硬件加速机制](#硬件加速机制)  
[JavaScript引擎](#javascript引擎)  
[插件和JavaScript扩展](#插件和javascript扩展)  
[多媒体](#多媒体)  
[安全机制](#安全机制)  
[移动Webkit](#移动webkit)  
[调试机制](#调试机制)  
[前端未来](#前端未来)  

### 浏览器和浏览器内核
#### 浏览器特性
1. 网络 下载资源
2. 资源管理 管理网络资源及本地文件，如确定是否使用缓存
3. 网页浏览 将资源转换为可视化结果
4. 多页面管理 多个页面或窗口
5. 插件和扩展
6. 账号和同步
7. 安全机制
8. 开发者工具

#### HTML5新特性
| 类别| 规范|
|---|---|---|
| 离线   | cache、storage、indexDb等|
| 存储   | cache、storage、indexDb等|
| 连接   | websocket、server-send等|
| 文件访问| file API（read、write）等|
| 音频视频| webRTC、video track、video、audio等|
| 语义化  | 新增标签|
| 3D和图形| canvas、css3D、webGL、svg等|
| 展示   | css新特性等|
| 性能   | worker、performance等|
| 其他   | 其他|

#### webkit基础
目前主流浏览器内核（渲染引擎）基本可以分为三种，ie的Trident，firefox的Gecko与webkit  
我们可以将内核看作是一个黑盒，但都是完成 HTML,css,js-->浏览器渲染引擎-->图像 的过程  
而渲染引擎从宏观上来看是通过 HTML解释器、css解释器、js引擎、布局（layout）、绘图模块构成  
整个过程大概是  
1. 下载资源，将html文件交给html解释器，解析成dom树
2. 解析期间遇到css交给css解释器；遇到js交给js引擎
3. dom树建立完成接收css解释器的样式信息，构建一个新的内部绘图模型（计算各个元素大小位置）
4. 绘图模块将绘图模型绘制

2005年苹果开源了webkit源码，后谷歌与苹果出现分歧，基于webkit开发了blink内核，包括safari内核也是基于webkit开发的webkit2

### HTML网页和结构
### Webkit架构和模块
### 资源加载和网络栈
### HTML解释器和DOM模型
### CSS解释器和样式布局
### 渲染基础
### 硬件加速机制
### JavaScript引擎
### 插件和JavaScript扩展
### 多媒体
### 安全机制
### 移动Webkit
### 调试机制
### 前端未来
