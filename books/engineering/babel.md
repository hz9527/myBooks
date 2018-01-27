## babel
在前端工程化进程上由于历史原因，我们不得不为一些事情做出妥协，如代码兼容问题。现在见到的几乎所有模块打包器、构建工具都支持babel。  
我们知道从2015开始，ECMA就开始每年更新一次ECMAScript，而怎么更新？更新依据从哪来？那么TC39 VIPj就出现了，交钱、注册会员提交你想要的，比如你觉得ECMAScript应该内置MAP对象。ok尽情提交提案吧，反正我每年就更新一次，所以stage-x也就出来了－－未被批准为 JavaScript 版本一部分的语言  
1. stage-0 稻草人： 只是想法，还未实现
2. stage-1 提案： 可能有算法及数据结构上的实现，但也只是尝试阶段
3. stage-2 初稿： 完成初步规范
4. stage-3 候选： 完成规范和浏览器初步实现
5. stage-4 完成： 将被添加到下一年度发布
那么问题来了，不至于每位VIP将自己的提案实现单独写一个编译器吧？所以babel就是做这件事的－－实现新语法  
想法很好，可是10年前的js引擎支持吗？显然不支持啊，箭头函数我写进规范了，已经实现了这种语法，可是浏览器error了，好吧给你加个垫片吧，polyfill便应运而生  

babel已经拆分成多个部分，基本可以这样理解，`core`、`presets`、`polyfill`、`plugins`等  
1. core 负责内核部分，理解起来也很简单，语法实现
2. presets 预设，你要我支持哪些语法？state-0还是state-4？
3. polyfill 语法你倒是实现了，可是我跑在浏览器就报错。好吧给你垫吧垫吧
4. plugins 哎呀webpack有动态import的能力，好吧给你个钩子，你写个插件你自己捣鼓吧

### babel集成
#### babel集成到rollup
babel集成到rollup比较简单，只需要一个插件`rollup-plugin-babel`
```
```

#### babel集成到webpack

### babelrc
