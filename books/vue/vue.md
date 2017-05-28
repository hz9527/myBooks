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
vue是一款轻量级mvvm框架，轻到使用vue做动画都很流畅，下面介绍两种，过渡与动画
### 过渡
vue为开发者提供了transition及transition-group 标签  
两者区别在于前者需要一个根标签包裹，后者则不需要  
标签提供了name属性，以供class变化使用  
整个流程可以理解为(以transition为 :chestnut:)
> enter: append dom or display:block --->  name-enter -> name-enter-active   
> leave: name-leave-active -> name-leave  ---> remove dom or display:none
> display: none -> name-enter(time-stamp) ---> name-enter-active(transition) --- root class --- name-leave-active(transition) --- name-leave

整个过程name-enter-active与root class瞬间切换，name-leave-active与root class瞬间切换，而为了将rootcalss与transition钩子分开，  
**所以进入初始化样式给name-enter，离开初始化样式给name-leave-active，过渡逻辑交给两个active**  
另外根元素vshow或vif变化都能引发transition class变化  
当然transition还提供了js钩子，以事件形式体现
```JavaScript
<transition
  v-on:before-enter="beforeEnter"
  v-on:enter="enter"
  v-on:after-enter="afterEnter"
  v-on:enter-cancelled="enterCancelled"
  v-on:before-leave="beforeLeave"
  v-on:leave="leave"
  v-on:after-leave="afterLeave"
  v-on:leave-cancelled="leaveCancelled"
>
  <!-- ... -->
</transition>
```
> 当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。即使在技术上没有必要，给在 <transition> 组件中的多个元素设置 key 是一个更好的实践。

#### transition-group
transition使用场景是整体的show或hide（如vif velse）但每次只会出现一个根元素并整体替换，而group场景则是局部替换，比如列表的插入，排序，移除动效  
transition-group自带flip队列动画，并提供额外的name-move钩子意味着transition钩子一样，move钩子主要用于排序移动动效

> 讲到着，还有一个问题关于渲染内置组件问题，比如router－link默认渲染成a标签可以通过tag属性更改。transition及transition－group默认不渲染，也可以指定tag

### 动画
和transition不一样，动画主要原理是通过watch一个变化然后异步更改，可能需要反复调用

## 关于自定义
vue扩展性还是非常不错的，可以通过自定义标签来封装组件，可以通过自定义指令来扩展指令，还可以自定义过滤器等
### 自定义标签
1) vue.extend  
使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象(组件)。  
2) vue.component  
注册一个全局组件，其实就是实例化并分配一个id的vue‘子类’  
```JavaScript
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))
// 注册组件，传入一个选项对象（自动调用 Vue.extend）
Vue.component('my-component', { /* ... */ })
```

### 自定义指令
自定义指令其实不论是动态绑定值还是事件其实对于调用者都一样，因为函数也是一种对象  
1）Vue.directive  
2) directives  
类似filter都支持全局与局部的记的加s  
可以想象如果支持@，vue将无法知道这个是一个自定义指令还是监听一个事件（子组件），因此自定义指令只能使用v-name
```JavaScript
Vue.directive('test', {
  bind () {}, // 组件创建时钩子
  inserted () {}, // 被绑定元素插入到父组件时调用
  update () {}, // 所在模版更新时调用
  componentUpdated () {}, // 所在模版更新完成时
  unbind () {} // 组件销毁时调用
})
```
在一个组件声明周期内update，componentUpdated钩子会反复调用其他不会，接下来我们看看参数列表
```JavaScript
[
  el,
  {
    def: {bind...}, // 该指令绑定的钩子
    expression: String, // 指令字符串表达式，如v-demo='test + 1' test ＋ 1
    modifiers: {}, // 参数，如v-demo.sync.once = 'click' {sync: true, once: true}
    name: String, // 指令名 demo
    rawName: String, // 指令绑定名，v-demo
    value: '' // 指令值的真实值，如v-demo='test + 1' test : 2 -> 3 test fn -> fn
  },
  vnode,
  oldVnode // 看了前面应该知道，这个只有在update和componentUpdated有
]
```
> 大致看了下，组件被销毁vue会帮你移除事件，具体没考证，demo表现大致如此，而且不论如何绑定事件this不会丢失

建议：
1. 可以考虑使用指令参数
2. 绑定事件做好直接使用obj.value，方便手动移除

### mixin
类似class的extends，官方不推荐使用，不过目测挺适合做单测
## 关于插件
插件通常能为vue添加一些全局方法。一般分以下几种：
1. 添加全局方法或者属性，如vue－element
2. 添加全局资源，如指令，过滤器，组件等，如vue－touch
3. 通过全局mixin添加一些组件选项，如vuex
4. 添加vue实例方法，通过原型实现，如vue－resource
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能，如 vue-router
Vue.js 的插件应当有一个公开方法 install 。这个方法的第一个参数是 Vue 构造器 , 第二个参数是一个可选的选项对象:

```JavaScript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (options) {
    // 逻辑...
  }
}

// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin, Options)
```
注意到没，install并不是vue提供的，而是MyPlugin对象的
