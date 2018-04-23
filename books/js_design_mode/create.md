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

#### 工厂方法模式
工厂方法模式，和简单的工厂模式一样 —— 用于实例化多种类  
但肯定更为复杂一点，主要区别在于安全，其次必要的话可以形成超类  
**安全模式类**  
我们在使用一个构造函数不一定知道它是一个构造函数，所以加一点代码就可以避免这种事情发生
```javaScript
function Demo () {
  if (!(this instanceof Demo)) {
    return new Demo()
  }
  // ...
}
```
只需要判断`this`是否是构造函数实例即可  

如果工厂函数需要管理的类很复杂该怎么处理呢？  
**把构造函数写在工厂函数的原型上**
```JavaScript
function Factory (className) {
  if (this instanceof Factory) {
    return new this[className]()
  } else {
    return new Factory(className)
  }
}
Factory.prototype.classA = function () {
  // ...
}
Factory.prototype.classA.prototype.a = function () {
  // ...
}
// ...
```
> 安全模式类是一种很好的思想，就像类型检测一样，使得我们的构造函数只能用于构造对象，即使你没使用new关键字

#### 抽象工厂模式
抽象工厂模式是工厂方法模式的进一步改进，由于在js中没有抽象类这样的概念，abstract也是保留字，所以衍生出抽象工厂模式  
首先谈谈抽象类，比如我们会有一系列类，这些类又继承于某个超类，而这个超类的作用一方面是让子类继承一些属性（主要指函数属性），而有一些函数属性是希望被重写的，那么就出现这样的情景，通过一个工厂函数返回一个构造函数，并且检查构造函数是否重写了超类相关属性  

**非通用抽象工厂**  
假设有一个获得球子类的函数，获取球的半径和获取弹性方法是需要检查的  
```JavaScript
function BallFactory (construct) {
  if (typeof construct === 'function') {
    construct.prototype = new Ball()
    construct.prototype.constructor = construct
    return construct
  } else {
    throw new Error(`type error`)
  }
}
function Ball () {}
Ball.prototype.getRadius = function () {
  throw new Error('getRadius is necessary')
}
Ball.prototype.getStretch = function () {
  throw new Error('getStretch is necessary')
}
```

**更通用的抽象工厂**  
假设
```JavaScript

```

### 建造者模式

### 原型模式

### 单例模式

## 总结
这一部分主要是创建型设计模式，包括工厂模式（简单工厂模式、工厂方法模式、抽象工厂模式）、建造者模式、原型模式、单例模式  
工厂模式主要是通过工厂函数实现对象的创建
