目录：  
[vuex是什么](#vuex是什么)  
[vuex基本使用](#vuex基本使用)  
[如何划分？](#如何划分？)  
[详解API](#详解api)  
[event bus](#eventbus)  
[back](../../)
## vuex
### vuex是什么?
1. store save what state we want to manage 我们不应该直接去获取store中的状态，而应该代理其get与set行为这样才能做到一处change所有都能收到消息
2. getter getter就是代理获取
3. mutation mutation就是完成set，并由vuex完成state change的派发
4. actions 已经有了mutation，为什么还需要action呢？在于，我们不希望在vue中去完成异步操作后再执行mutaion，毕竟有写逻辑只是去为了维护state和组件关系并不大，因此可以将这一部分逻辑封装到actions中，由action完成异步的操作，再传递给mutation再由mutation去完成状态的派发

### vuex基本使用  
[toTop](#vuex)  
vuex部分可以类似以下代码：
```JavaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```
在vue中可以引入mapGetter与mapActions（或mutation）转化为vue的computed与methods参与进来
```JavaScript
import { mapGetter, mapActions } from 'vuex'

export default {
  // ...
  computed: {
    ...mapGetter([
      'state1',
      'state2'
    ]),
    ...mapGetter({
      s3: 'state3',
      s4: 'state4'
    })
  },
  methods: {
    ...mapActions([
      'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
    ]),
    ...mapActions({
      add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
    })
  }
}
```
### 如何划分？
通过上面我们知道了，我们可以把所有state交给store来管理了，将get操作交给了getter，将change交给mutations了，但是随着项目越来越大，不同的功能间一些state没有任何耦合，没有共享的必要了，所以vuex还提供了module来分离不同的state
```JavaScript
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```
注： 唯一的不同是引入了一个rootState作为getter与actions，mutation的第三个参数

### 详解API  
[toTop](#vuex)  
##### 1. all
```JavaScript
new Vuex.stroe({
  state: {}, // mapState
  getter: {}, // mapGetters
  mutations: {}, // mapMutations
  actions: {}, // mapActions
  modules: {}
})
```
在注入实例时添加store，这样每个组件都能获得到实例，否则只能拿到一个空的vuex
```JavaScript
new Vue({
  el: '#app',
  store: stroe,
  template: '<App/>',
  components: { App }
})
```
##### 2. state  
state在内部以对象形式存在，用于保存标识的变量，因此主要是保存数据的，key value形式。  
虽然提供了mapState接口，但是并不推荐使用这个接口
```JavaScript
import {mapState} from 'vuex'
...
computed: {
  mapState({
    state1: state => state.state1,
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
在组件内作为computed使用，并以函数方式使用，参数为state
##### 3. getter
第一个参数为state，但是你知道第二个参数是getter吗？
这个getter相当于返回其get value  
比如：我们用state维护list，用getter维护chooseList（返回list的子数组），那么我们还想维护chooseList length怎么办？  
这个时候getter参数就有意义了  
注：在modules中第三个参数为rootState
```JavaScript
new vuex.Stroe({
  state: {
    list: [...]
  },
  getter: {
    chooseList: (state) => state.filter((item) => item.choose),
    chooseListLength: (state, getter) => getter.chooseList.length
  }
})
```
暴露给vue接口mapGetters配合computed使用，[具体可以见](#vuex基本使用)
##### 4. mutations
第一个参数是state，第二个参数是newValue，在modules中第三个参数是rootState。暴露给vue的接口是mapMutations  
在vue中作为methods使用，只需要传入newValue参数即可
```JavaScript
mutations: {
  setV (state, v) { // 相当于执行了state.commit('setV' {v: v})
    state.v = v
  }
}
```
注： mutations中相当于同步执行了set，因此最好不要在内部使用异步，如果非要使用异步，请使用actions  
当然我们也可以在一个mutations中操作多个state，不过这个时候建议用actions试试commit，因为这个还不清楚它是不是同步订阅异步发布
##### 5. actions
第一个参数是state（官方文档用的context），第二个参数还是newValue，在modules中第三个参数是rootState。暴露给vue的接口是mapActions  
其实个人觉得actions主要是为了聚合mutations操作或异步操作mutations的
```JavaScript
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, v) {
      state.count = v
    }
  },
  actions: {
    increment (context, v) { // 相当于执行了state.dispatch(mutationName, value)
      context.commit('increment', {count: v})
    },
    test ({commit}, v) {
      commit('increment', v)
    }
  }
})
```
是时候小结一下了，从上面我们基本可以看出一些端倪了，虽然vuex给暴露给vue有mapState，mapGetters，mapMutations，mapActions  
但是我们全部可以使用state来完成上面的操作对应的分别是state，state，state.commit,state.dispatch
##### 6. modules
使用与普通的一致，因此为了防止有同名的getters mutations actions，官方给的方案是加一个命名空间

## eventBus  
[toTop](#vuex)  
1. 在全局到处一个空的vue实例 export default new Vue()
2. 在需要发布事件或监听事件的组件内引入vue空实例 import bus from './bus.js'
3. 在合适的钩子里监听事件 如created bus.$on(eventName, handler)
4. 在合适的地方发送消息，如click bus.$emit(eventName, message)
