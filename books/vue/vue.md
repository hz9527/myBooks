**vue进阶**
#### 目录
[**基础**](#)  
[关于生命周期](#关于生命周期)  
[关于data](#关于data)  
[关于指令](#关于指令)  
[关于实例化](#关于实例化)  
[关于实例配置项](#关于实例配置项)  

[**动画与过渡**](#)  
[过渡](#过渡)  
[动画](#动画)  

[**关于自定义**](#)  
[自定义标签](#自定义标签)  
[自定义指令](#自定义指令)  
[mixin](#mixin)  

[**关于插件**](#)  

## 基础
### 关于生命周期
1. beforeCreate 此时数据依赖模型还未建立
2. created 此时dom还未挂载
3. mounted 此时dom已挂载，可以访问this.$el了
4. beforeUpdate 对比vnode之前，因此还可以在这操作数据
5. updated 重绘完成，请不要在这操作被vnode追踪的值
6. activated keep-alive 组件激活时调用。
7. deactivated keep-alive 组件停用时调用。
8. beforeDestroy 实例销毁之前调用。在这一步，实例仍然完全可用
9. destroyed Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁

关于keepalive  
试想以下场景：一个具有复杂状态的列表页，或许你都无法整理他需要多少状态来维护，如筛选，分页，scroll（当然这只是个简单的例子，毕竟通过vuex，router钩子可以很轻易做到这些），跳转至详情页，再从详情页返回我们希望以上状态恢复（详情页不是子路由）就可以尝试使用keepalive  


### 关于data  
我们知道vue拥有强大的数据追踪机制，但是有一些target我们是不希望被追踪的（不被代理），如何实现呢？vue不会代理以_或$开头的data属性，因此可以使用他们，对了最好加一些命名空间，否则可能会与vue代理的值产生矛盾

### 关于指令
其实我们平时常用的指令只有那么一些:class :style @xx :html v-for v-show v-if，但是vue提供的指令远远不止这些，而且指令还可以有修饰符  
1. disabled 适用于大多表单元素
2. text 和双括号效果一致
3. else-if 配合v-if使用
4. pre vue将跳过该标签编译，如一些写死的部分可以是使用，能提升编译及vnode计算速度
5. cloak 这个指令保持在元素上直到关联实例结束编译。和 CSS 规则如 [v-cloak] { display: none } 一起用时，可以隐藏未编译的 Mustache 标签直到实例准备完毕。
6. once 仅第一次编译，随后的重新渲染,元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

#### 修饰符
1）v-on
* stop停止冒泡
* prevent阻止默认事件可以没有事件，只是单纯阻止默认事件
* capture在捕获阶段触发
* self只有target为绑定元素才触发
* {keyCode | keyAlias}事件为特定键触发
* native原生事件
* once仅绑定一次
* left right middle鼠标左右中键触发
* passive [mdn](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

```JavaScript
<div @click.stop.right='click("type", $event)'>click</div>

<form @submit.prevent='submit'></form>

<input @keydown.13='keydown'/>
<input @keydown.enter='keydown'/>

<my-omponent @click.native='click' />
```
可以链式使用修饰符，在部分上可以不用表达式，如阻止默认事件，在组建上可以区分dom事件与组件事件(默认都是监听组件事件)
关于passive  
简单来说默认事件都会等待绑定事件执行完确认里面没有preventDefault才会执行，这显然会使得这种等待没太多意义，所以可以定义默认事件不必等待绑定事件，具体参考上述文章

2）v-model
* lazy 将input事件改为change事件
* number 输入数字改为字符串
* trim 过滤空格

### 关于实例化
在实例化一个Vue时，我们更多的是直接用模版，那么那些配置到底是如何配置的？
```JavaScript
new Vue({
  el: '#app',
  router,
  vuex,
  template: '<App/>',
  components: {App}
})
```
其实实例化vue并挂载到页面中和我们写组件一模一样，只是多了一个挂载项  
> 在实例化 Vue 时，需要传入一个选项对象，它可以包含数据、模板、挂载元素、方法、生命周期钩子等选项

只是平时用loader习惯了，没有意识到template。这个是在入口文件写的即.js而不是.vue文件  
其实还可以将template与components合并
```JavaScript
new Vue({
  el: '#app',
  router,
  vuex,
  render: (createElement) => createElement(App)
})

new Vue({
  router,
  template: '<App />',
  components: {App}
}).$mount('#app')
```
当然我们还可以为这个入口vue添加钩子等

### 关于实例配置项

## 动画与过渡
### 过渡
### 动画

## 关于自定义
### 自定义标签
### 自定义指令
### mixin

## 关于插件
