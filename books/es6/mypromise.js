function MyPromise (executor) {
  this.status = 'pending'
  this.data = null
  this.timer = null
  this.queue = []
  try {
    executor.bind(this)(this._setState('resolved'), this._setState('rejected'))
  } catch (err) {
    clearTimeout(this.timer)
    this._setState('rejected')(err)
    // console.log('here error', this.status)
  }
}

MyPromise.prototype._setState = function (state) {
  return data => {
    this.timer = setTimeout(() => {
      if (this.status === 'pending') {
        try {
          this._execQueue(state, data)
        } catch (err) {
          this._execQueue('rejected', err)
        }
      }
    }, 10)
  }
}

MyPromise.prototype._execQueue = function (state, data) {
  this.status = state
  this.data = data
  this.queue.forEach(item => item[state](data))
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  let that = this
  return new MyPromise(function (resolve, reject) {
    if (that.status === 'pending') {
      that.queue.push({
        resolved: () => this._resolvePromise(onResolved, resolve, reject, that),
        rejected: () => this._resolvePromise(onRejected, resolve, reject, that)
      })
    } else {
      this._resolvePromise(that.status === 'resolved' ? onResolved : onRejected, resolve, reject, that)
    }
  })
}

MyPromise.prototype._resolvePromise = function (subscribe, resolve, reject, prePromise) {
  // 1. 如果订阅函数返回是promise，那么当前promise状态由返回的promise决定
  // 2. 如果订阅函数为空只需要将状态和上一个promise返回向下传递即可
  // 3. 如果订阅函数非法reject，否则resolve
  let type = typeof subscribe
  let result = type === 'function' ? subscribe(prePromise.data) : type === void 0 ? preData : 'o error'
  if (result instanceof MyPromise) {
    result.then(resolve, reject)
  } else {
    if (type === void 0) {
      prePromise.status === 'resolved' ? resolve(result) : reject(result)
    } else if (type === 'function') {
      resolve(result)
    } else {
      reject(result)
    }
  }
}

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

let test = new MyPromise(resolve => {
  setTimeout(resolve, 50, 'mypromise1')
})
test.then(res => {
  console.log(res, 1)
  return new MyPromise(resolve => {
    resolve(456)
    sbsb
  })
}).then(res => {
  console.log(res, 2)
}).then(res => {
  console.log(res, 3)
}).catch(err => {
  console.log('error')
}).then(res => {
  console.log(res, 4)
  return new MyPromise(r => {
    console.log('hhh')
    r(234)
  })
}).then(r => console.log(r, 5))
.catch(e => console.log(e, 6));

new Promise(resolve => {
  setTimeout(resolve, 50, 'promise1')
}).then(res => {
  console.log(res, 1)
  return new Promise(resolve => {
    resolve(456)
    sbsb
  })
}).then((res) => {
  console.log(res, 2)
}).then(res => {
  console.log(res, 3)
}).catch(err => {
  console.log('error')
}).then(res => {
  console.log(res, 4)
  return new Promise(r => {
    r(234)
  })
}).then(r => console.log(r, 5))
.catch(e => console.log(e, 6))
