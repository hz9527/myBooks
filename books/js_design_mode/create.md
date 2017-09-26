## 创建型设计模式
创建型设计模式是一类处理对象创建的设计模式，通过某种方式控制对象的创建来避免基本对象创建时可能导致设计上的问题或增加设计上的复杂度。
### 工厂模式
试想以下场景，需要封装一系列类，这些类可能有相似的地方也有不同的地方，如果封装了N多构造函数可能会导致使用者的困惑，最好的方式是使用简单工厂模式  
#### 简单工厂模式
简单工厂模式主要分两种，一种是基于类的封装，一种是封装类，什么意思呢？  
如果一些对象需要经常被创建，那么应该将这些对象使用构造函数进行实例化，也就是需要维护工厂函数和其构造函数，另一种就是这些对象不需要经常性被创建，那么完全没必要为这些对象写构造函数，而是直接实例化一个对象然后为这些对象添加上相应的方法和属性就好了，但这不影响简单工厂的作用——用于实例化一系列对象，方便调用者使用  
```javaScript
function Ball (name, people) {
  this.name = name
  this.people = people
}
Ball.prototype.sayName = function () {
  console.log('my name is' + this.name)
}
Ball.prototype.needPeople = function () {
  console.log('play' + this.name + 'need' + this.people)
}
function createBall (name) {
  var result
  if (name === 'baseketball') {
    result = new Ball(name, 10)
    result.play = function () {
      // ...
    }
  } else if (name === 'football') {
    result = new Ball(name, 22)
    result.fans = function () {
      // ...
    }
  }
  return result
}
```
```javaScript
function createSome (name) {
  var result = {}
  result.xx = 'xx'
  if (name === 'xx') {
    result.aa = 'bb'
  } else if (name === 'yy') {
    result.bb = 'cc'
  }
  return result
}
```

### 建造者模式

### 原型模式

### 单例模式
