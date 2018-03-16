## Promise实现

### 思考
1. 构造函数式，因此理解为是一个对象
2. resolve触发then，reject触发catch
3. 由于对于链式调用而言，是同步的
4. 状态更新来决定执行

调用示例
```JavaScript
new Promise((resolve, reject) => {
  resolve(123)
}).then(res => {
  return new Promise(resolve => {
    resolve()
  })
}).then...
```

第一步
```JavaScript
function Promise (exec) {
  this.state = 'pending'
  this.data = null
  function resolve () {}
  function reject () {}
  exec(resolve, reject) // 当内部使用resolve或reject触发then内回掉函数，使用reject触发catch回掉
}
```
首先思考一个问题，resolve和reject来自哪里？  
对，它是执行函数传递的参数，因此是Promise提供的

当执行resolve时就可以进行状态更新，状态更新引发函数执行

第二步
```JavaScript
function Promise (exec) {
  this.state = 'pending'
  this.data = null
  function resolve () {

  }
  function reject () {}
  exec(resolve, reject) // 当内部使用resolve或reject触发then内回掉函数，使用reject触发catch回掉
}
Promise.prototype.then = function (resolveCb, rejectCb) {
  // 将
}
```
