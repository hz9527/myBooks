## Promise实现

### 思考
1. 构造函数式
2. resolve触发then内第一个监听函数，reject触发catch或resolve第二个监听函数
3. 由于链式调用then、catch，因此返回是同步的
4. 状态更新来决定执行执行哪个监听函数，状态更新由resolve或reject执行决定
5. 在链式调用时下一次接收值为上一次fulfilled状态后return的值或resolve，reject的值

调用示例
```JavaScript
new Promise((resolve, reject) => {
  resolve(123)
}).then(res => {
  return new MyPromise(resolve => {
    resolve(321)
  })
}).then...
```

第一步
```JavaScript
function MyPromise (exec) {
  this.status = 'pending'
  this.data = null
  function resolve () {} // 用于更改状态
  function reject () {} // 用于更改状态
  exec(resolve, reject) // 当内部使用resolve或reject触发then内回调函数，使用reject触发catch回调
}
```
首先思考一个问题，resolve和reject来自哪里？  
对，它是执行函数传递的参数，因此是MyPromise提供的  

当执行resolve或reject时就可以进行状态更新，状态更新引发函数执行  
链式调用时每次都会返回一个新的Promise对象，但是其resolve或reject状态并未确定，直到上一个Promise到达fulfilled状态触发新的promise状态  
因此在这里需要形成一个链表由上一个决定下一个

第二步
```JavaScript
function MyPromise (exec) {
  this.status = 'pending'
  this.data = null
  this.onResolvedCallback = [] // 存储自己及then返回回调
  this.onRejectedCallback = [] // 存储自己及then、catch返回回调
  let resolve = res => { // 更新状态并执行订阅函数，订阅函数由then完成
    if (this.status === 'pending') {
      this.data = res
      this.status = 'resolved'
      this.onResolvedCallback.forEach(fn => fn(this.data))
    }
  }
  let reject = err => { // 更新状态并执行订阅函数，订阅函数由then或者catch完成
    if (this.status === 'pending') {
      this.data = err
      this.status = 'rejected'
      this.onRejectedCallback.forEach(fn => fn(this.data))
    }
  }
  exec(resolve, reject) // 当内部使用resolve或reject触发then内回调函数，使用reject触发catch回调
}
MyPromise.prototype.then = function (onResolved = () => {}, onRejected = () => {}) {
  this.onResolvedCallback.push(onResolved)
  this.onRejectedCallback.push(onRejected)
  // 返回一个MyPromise对象
  return new MyPromise((resolve, reject) => {})
}
```

我们只知道链式调用意味着无论如何都会返回一个新的Promise对象，但这个Promise的订阅函数的入参（下一个then或catch的参数）是由上一个订阅决定的  
另外我们可以异步执行then或catch，因此不应该把当前promise监听函数放在队列里，因为它可能还没定义

第三步
```JavaScript
function MyPromise (exec) {
  this.status = 'pending'
  this.data = null
  this.onResolvedCallback = [] // 存储then返回回调
  this.onRejectedCallback = [] // 存储then、catch返回回调
  let resolve = res => { // 更新状态并执行订阅函数，订阅函数由then完成
    if (this.status === 'pending') {
      this.data = res
      this.status = 'resolved'
      this.onResolvedCallback.forEach(fn => fn(this.data))
    }
  }
  let reject = err => { // 更新状态并执行订阅函数，订阅函数由then或者catch完成
    if (this.status === 'pending') {
      this.data = err
      this.status = 'rejected'
      this.onRejectedCallback.forEach(fn => fn(this.data))
    }
  }
  exec(resolve, reject) // 当内部使用resolve或reject触发then内回调函数，使用reject触发catch回调
}
MyPromise.prototype.then = function (onResolved = () => {}, onRejected = () => {}) {
  // 返回一个MyPromise对象，由于可能异步调用then或catch方法，所以这里会出现三种状态的可能
  let that = this
  return new MyPromise((resolve, reject) => {
    let result
    if (that.status === 'pending') { // executor执行订阅函数
      // 此时状态还未确定，所以放在队列里执行
      that.onResolvedCallback.push(function () {
        result = onResolved(that.data)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        }
        resolve(result) // 手动执行新的MyPromise
      })
      that.onRejectedCallback.push(function () {
        result = onRejected(that.data)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        }
        resolve(result) // 手动执行新的MyPromise
      })
    } else {
      if (that.status === 'resolved') {
        result = onResolved(that.data)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        }
        resolve(result) // 手动执行新的MyPromise
      } else if (this.status === 'rejected') {
        result = onRejected(that.data)
        if (result instanceof MyPromise) {
          result.then(resolve, reject)
        }
        resolve(result) // 手动执行新的MyPromise
      }
    }
  })
}
```

好，到这一步主体逻辑我们已经完成，剩余catch的实现，容错处理及异步实现及then内return的代码复用  

第四步
```JavaScript
function MyPromise (executor) {
  this.status = 'pending'
  this.data = null
  this.onResolvedCallback = []
  this.onRejectedCallback = []
  let reject = this._setState('rejected')
  try {
    executor(this._setState('resolved'), reject)
  } catch (err) {
    reject(err)
  }
}

MyPromise.prototype._setState = function (state) {
  return (data) => {
    if (this.status === 'pending') {
      this.status = state
      this.data = data
      state === 'resolved' ? this.onResolvedCallback.forEach(fn => fn(this.data))
        : this.onRejectedCallback.forEach(fn => fn(this.data))
    }
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  typeof onResolved !== 'function' && (onResolved = data => {})
  typeof onRejected !== 'function' && (onRejected = data => {})
  let that = this
  return new MyPromise(function (resolve, reject) {
    if (that.status === 'pending') {
      that.onResolvedCallback.push(() => {
        that._execThen(onResolved, resolve, reject)
      })
      that.onRejectedCallback.push(() => {
        that._execThen(onRejected, resolve, reject)
      })
    } else {
      that._execThen(this.stauts === 'resolved' ? onResolved : onRejected, resolve, reject)
    }
  })
}

MyPromise.prototype._execThen = function (sub, nextResolve, nextReject) {
  let result = sub(this.data)
  if (result instanceof MyPromise) {
    result.then(nextResolve, nextReject)
  }
  try {
    nextResolve(result)
  } catch (err) {
    nextReject(err)
  }
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

```

接下来我们会发现当未传递onResolved及onRejected时值不能被传递，并且当一次reject会一直传递状态。当然，还应为onresolved，onrejected做一个异步处理

第五步
```JavaScript
function MyPromise (executor) {
  this.status = 'pending'
  this.data = null
  this.onResolvedCallback = []
  this.onRejectedCallback = []
  try {
    executor(this._setState('resolved'), this._setState('rejected'))
  } catch (err) {
    this._setState('rejected')(err)
  }
}

MyPromise.prototype._setState = function (state) {
  return data => {
    if (this.status === 'pending') {
      this.data = data
      this.status = state
      state === 'resolved' ? this.onResolvedCallback.forEach(fn => setTimeout(fn, 0, this.data)) :
        this.onRejectedCallback.forEach(fn => setTimeout(fn, 0, this.data))
    }
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  typeof onResolved !== 'function' && (onResolved = v => v)
  typeof onRejected !== 'function' && (onRejected = v => v)
  let that = this
  return new MyPromise(function (resolve, reject) {
    if (that.status === 'pending') {
      that.onResolvedCallback.push(() => {
        that._execThen(onResolved, resolve, reject, 'resolved')
      })
      that.onRejectedCallback.push(() => {
        that._execThen(onRejected, resolve, reject, 'rejected')
      })
    } else {
      that._execThen(that.status === 'resolved' ? onRejected : onRejected, resolve, reject, that.status)
    }
  })
}

MyPromise.prototype._execThen = function (subscribe, nextResolve, nextReject, state) {
  let result = subscribe.bind(this)(this.data)
  if (result instanceof MyPromise) {
    result.then(nextResolve, nextReject)
  } else {
    try {
      state === 'rejected' ? nextReject(result) : nextResolve(result)
    } catch (err) {
      nextReject(err)
    }
  }
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}
```
