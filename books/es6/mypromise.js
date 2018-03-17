// native promise
new Promise((resolve, reject) => {
  console.log(1)
  setTimeout(resolve, 50, 'promise1')
}).then(res => {
  console.log(2, res)
  return 'test1'
}).then(res => {
  console.log(3, res)
  return new Promise(resolve => {
    console.log(4)
    setTimeout(resolve, 50, 'promise2')
  })
}).then(res => {
  console.log(5, res)
}).catch(e => {
  console.log(6, e)
}).then(res => {
  console.log(7, res)
})

let test = new Promise(resolve => {
  console.log(321)
  resolve(123)
})
setTimeout(() => {
  test.then(res => {
    console.log(res)
  })
}, 500)

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
  typeof onRejected !== 'function' && (onRejected = data => {console.log('not handler error', data)})
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
let test = new MyPromise(resolve => {
  setTimeout(resolve, 50, 'promise1')
})
test.then(res => {
  console.log(res, 1)
  return new MyPromise(resolve => {
    resolve(456)
    xixixixi
  })
}).then(res => {
  console.log(res, 2)
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log('error')
})
