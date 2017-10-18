## es6学习
### 目录
基础  
[变量声明](#变量声明)  
[解构赋值](#解构赋值)  
数据类型的拓展  
[函数的拓展](#函数的拓展)  
[对象的拓展](#对象的拓展)  
[数组的拓展](#数组的拓展)  
[数值的拓展](#数值的拓展)  
[字符串的拓展](#字符串的拓展)  
[正则的拓展](#正则的拓展)  
新类型  
[Symbol](#symbol)  
[Set&Map](#set及map)   
异步方案  
[Promise](#promise)  
[遍历器](#遍历器)  
[Generator&其异步](#generator及其异步)  
[async](#async)  
类及模块  
[装饰器Decorator](#装饰器decorator)  
[类Class](#类class)  
[模块Module](#模块module)  
[es6模块与common.js及amd模块区别](#es6模块与其他模块区别)


### 变量声明  
[toTop](#es6学习)  
#### let&const  
**块级作用域**，两者声明的都是块级作用域变量
* 声明将不再提前，不能在声明前使用
* 声明不可重复，同一标识符在一个块作用域中只能使用一次
* 块外部不可访问  

#### let  
**隐形闭包**  
在for循环中，隐藏两个块作用域，循环头一个块，循环体一个，每次循环创建一个块，因此使用let循环能产生‘隐形闭包’  

#### const  
**不可进行LHS**  
使用const声明变量不能使用LHS来对变量赋值，但并不意味着不能更改，如const声明一个对象，那么该对象的引用不能变，但是对象本身是可以变的。  
**必须赋值**  
es6规定，const声明的标识符必须同时赋值  

#### 拓展  
1. window所有属性均可以省略window
```JavaScript
window.a = 2;
a = 1//<==>window.a,因为为执行window.a = 2直接a=1会报错
```
2. web worker中没有window对象，但是在浏览器和web worker中self都会指向顶层对象
3. 在node中顶层对象使用global
4. 在es5其实不允许在块作用域中声明提前方式声明函数
***
### 解构赋值  
[toTop](#es6学习)  
#### 1.定义
从数组和对象中提取值，对变量进行赋值，这被称为解构
#### 2.基本使用

```JavaScript
let [a, b] = [1, 2] // a 1 b 2

let [a, [b], c] = [1, [2], 3] // a 1 b 2 c 3 一一对应关系

let [a, b] = [1, 2, 3] // a 1 b 2

let [a, b, c] = [1, 2] // a 1 b 2 c undefined 结构不成功默认为undefined

let [a, ...b] = [1, 2, 3] // a 1 b [2, 3] 支持rest

```

> 被解构的部分需要具备迭代器功能

***
### 函数的拓展  
[toTop](#es6学习)  
#### 1.参数默认值
可以理解为在参数中执行了let
1. 函数体内不可使用同名块级作用域声明
2. 不能使用同名参数，即使未对该参数设置默认值
3. 默认值可以是动态的
4. 指定默认值后函数长度失真（指定默认值参数不计入长度中）

#### 2.rest参数
ES6 引入 rest 参数（形式为“...变量名”），用于获取函数的多余参数，这样就不需要使用arguments对象了。适用于数组，对象甚至字符串
1. rest参数只能作为最后一个参数
2. 同样，rest参数会被length忽略

*扩展*  
>...除了定义参数，还可以传实参（这个就不要求后面不能有参数了），最大作用就是取代apply与arguments组合了

>当然...除了作为参数也是一种运算符，运用十分广泛

#### 3.箭头函数
1. 基本使用 v => v 类似于function(v){return v}
2. 多个参数时需要用括号(v1, v2) => v1 + v2
3. 函数体如果有块级部分必须扩起来，如变量声明；等
4. 只能使用var fn = n => n;形式赋值
5. this遵循作用域链原则
6. arguments不存在
7. 不能作为构造函数
8. 不可以使用yield命令，因此箭头函数不能用作Generator函数。
9. 环境栈不变，即访问this是父环境

#### 4.严格模式
ECMAScript 2016标准》做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

#### 5.name
返回函数名，作为函数的属性

#### 6.this绑定
一种是bind 一种是::
```javaScript
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);
```

#### 7.尾调用优化

#### 8.逗号
***
### 对象的拓展
[toTop](#es6学习)   
***
### 数组的拓展
[toTop](#es6学习)  
#### 1.Array.from
在面对类数组对象想将其转化为数组，如domlist arguments
```javaScript
var likeArr = {
	'0': 1,
	'1': 2,
	length: 2
}
//es5
var arr = Array.prototype.slice.call(likeArr);
//es6
var arr = Array.from(likeArr)
```
#### 2.Array.of
我们知道new Array有一个bug，就是传入一个参数表示数组长度，多个参数则是数组每一个值，Array.of就解决了这个问题，参数即数组的每一项

#### 3.Array.copyWithIn
三个参数，第一个参数是替换起点，第二个参数是替换子数组起始位置，第三个参数为替换子数组结束位置，支持负数。改变原数组
```JavaScript
var arr = [1,2,3,4,5];
console.log(arr.copyWithIn(-4,-2))//[1,4,5,4,5]
```

#### 4.find findIndex
参数为回调函数，类似String.prototype.index,返回第一个符合回调函数要求的项（或下标）
```JavaScript
var arr = [1,2,-3,-4,5];
arr.find((n) => n < 0);//-3
arr.findIndex(n => n < 0);//2
```
#### 5.fill
可以作为初始化数组使用，第一个参数为填充值，第二个参数为填充起始下标，第三个参数为结束下标(含头不含尾)
```javaScript
new Array(3).fill([1,2]);//[[1,2],[1,2],[1,2]]
new Array(3).fill(2,1,2);//[undefined,2,undefined]
```

#### 6.entries keys values
我们知道在js中数组底层实际是对象，因此也有key value一说
```javaScript
var arr = ['hh','xx'];
for (var key in arr.keys()) {
	console.log(key);//0 1
}
for (var value in arr.values()) {
	console.log(value);//'hh' 'xx'
}
for (var [key, value] in arr.entries()) {
	console.log(key, value)
}
```
#### 7.includes
见名知意，判断数组中是否包含某一项,第一个参数为校验项，第二个参数为开始下标  
注：这里的比较是直接使用比较符，即对象不对比值是否相同而是对比引用是否相同
```javaScript
var arr1 = [1,2,3];
arr1.includes(2);//true
arr1.includes(2,2);//false

var arr2 = [
	{a:1,b:2},
	{c:3,d:4}
];
arr2.includes({a:1,b:2});//false
var item = arr2[0];
arr2.includes(item);//true
```
#### 8.空位处理
数组某一项空位和值为undefined是不一样的


### 数值的拓展
[toTop](#es6学习)  
#### 1.判断 Number.isNaN Number.isFinite Number.isInteger
判断一个数是否是NaN，无限大，整数  
注：判断是否是整数只是判断其浮点位是否为0
```JavaScript
var a = 30.0;
Number.isInteger(a);//true
```
#### 2.重写Number.parseInt Number.parseFloat
这两个方法没有任何变化，只是从全局函数变为Number原型方法，减少全局函数数量

#### 3.Math内置对象的拓展
1. Math.trunc 返回整数部分
2. Math.sign 判断一个数是正数负数还是0（＋－）返回+1 -1 +0 -0
3. Mah.signbit -0 <0 true +0 >0 false

#### 4.新增运算符 **
```
console.log(2**3)//8 2的三次方
```
***
### 字符串的拓展
[toTop](#readme)
#### 1.遍历器（for of）
#### 2.子字符串方法（startsWith endsWith includes）
es5仅提供了indexOf()lastIndexOf()来判断参数字符串在字符串中下标，以上三个接口均返回布尔
#### 3.重复字符串（repeat）
参数为数字
```JavaScript
 var a = 'h';
 a.repeat(2)//'hh'
```
#### 4.补全字符串（padStart padEnd）
第一个参数是补全长度，第二个是使用补全的字符,如果原字符长度长于规定长度，返回原字符串；如果补全字符串长于需要补全长度，那么会截取需要的长度；如果补全字符为空，则以空格补全

#### 5.字符串模版
在js中经常需要拼接字符串，在es6中提供了字符串模版
```javaScript
var name = 'hz';
var age = 24;
console.log(`my name is ${name} and i am ${age}`)//my name is hz and i am 24
```
使用${}盛放js表达式，意味着可以使用函数
***
### 正则的拓展
[toTop](#es6学习)  
***
### symbol
[toTop](#es6学习)  
***
### set及map
[toTop](#es6学习)  
***
### promise  
[toTop](#es6学习)  
#### 1.基本使用
单线程，异步，无阻塞，事件循环。js最具特色的地方。  
Promise对象专门来解决这些问题的，通过resolve与reject来调用异步处理函数
```JavaScript
new Promise((resolve, reject) => {
	setTimeout(() => {
		if (...) {
			resolve(data) // 成功的回调
		} else {
			reject(err) // 失败的回调
		}
	})
}).then((res) => {
	... // deal success
}, (res) => {
	... // deal fail
})
```
#### 2.Promise.prototype.then
在then处理函数还可以继续使用then来调用上一个的返回，比较牛的是，可以继续返回一个新的promise
```JavaScript
new Promise((resolve, reject) => {
	resolve(1)
}).then((res) => {
	console.log(res) // 1
	return 2
}).then((res) => {
	console.log(res) // 2
})

// return a new Promise
new Promise((resolve, reject) => {
	resolve(1)
}).then((res) => {
	console.log(res) // 1
	return new Promise((resolve, reject) => {
		resolve(5)
	})
}).then((res) => {
	console.log(res) // 5
})
```
#### 3.Promise.prototype.catch
catch能够捕捉到未执行的reject，执行中的错误(try catch)  
因此推荐在then只处理成功，通过catch来批量处理错误

#### 4.Promise.all
参数为一个可遍历的对象，如数组，map等，每一项为一个Promise对象，如果不是会调用Promise.resolve将其转化  
将一组Promise封装成一个Promise
1.如果全部resolved，则将执行resove，参数为一个数组，存放着每一个resolve的返回  
2.如果其中至少一项为reject，则执行reject并返回第一个reject的返回

#### 5.Promise.race
参数与all相同，当一个状态变更，则新Promise状态就是那个状态，不论是reject还是resolve
#### 6.Promise.resolve

#### 7.Promise.reject

#### 8.Promise.prototype.done
#### 9.Promise.prototype.finally
***
### 遍历器
[toTop](#readme)
### Generator及其异步  
[toTop](#readme)
### async
[toTop](#es6学习)  
***
### 装饰器decorator  
[toTop](#es6学习)  
#### 1.类的装饰
在装饰者模式中，我们知道一个类不需要具有太多功能，可以通过装饰者模式来对类的功能进行拓展。当然在类也可以通过继承的方式衍生来实现，而es7明确提出了装饰符
> 修饰器（Decorator）是一个函数，用来修改类的行为。这是ES7的一个提案，目前Babel转码器已经支持。
修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。

```JavaScript
// 以下代码需要babel转译并使用experimental
function testAble (Obj) {
	Obj.isTeasAble = true
}
@testAble class MyClass {}
console.log(MyClass.isTeasAble) // true
```
以上案例会让我们觉得装饰器内是写死的（装饰期间默认执行函数，并默认传入需要包装的类），那么如何传入更多的参数？  
我们知道装饰器是函数，并只能传入一个参数（被装饰的类），那么我们可以通过闭包的方式（函数式）完成
```JavaScript
function myDecorator (arg) {
	return function (target) {
		... // can use arg
	}
}
@myDecorator(arg) class MyClass {}
```
当然以上都只是添加静态属性(如果是静态方法记得实例是访问不到的哦)，我们应该为之添加原型属性，记得使用prototype即可


#### 2.方法的装饰
我们除了可以装饰类（为其添加静态属性、方法或原型属性、方法）还可以去装饰类的方法
```JavaScript
function (target, name, descriptor) {
	// descriptor对象原来的值如下
  // {
  //   value: specifiedFunction, // target.name
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
	... // change descriptor
	return descriptor
}
```
面向剖面编程（AOP），执行时打印log
```JavaScript
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling "${name}" with`, arguments);
    return oldValue.apply(null, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```
> 如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。对了，返回的装饰可以是函数

```JavaScript
function dec(id){
    console.log('evaluated', id);
    return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```

#### 3.为什么装饰器不能用于函数
我们知道类是不会声明提前的，而且装饰是发生在编译期间的，因此这就是函数不能被装饰的原因
#### 4.core-decorators.js
core-decorators.js是一个第三方模块，提供了几个常见的修饰器，通过它可以更好地理解修饰器。
[go](http://es6.ruanyifeng.com/#docs/decorator#core-decorators-js)

#### 5.使用修饰器实现自动发布事件
我们可以使用修饰器，使得对象的方法被调用时，自动发出一个事件。
```JavaScript
import postal from "postal/lib/postal.lodash";

export default function publish(topic, channel) {
  return function(target, name, descriptor) {
    const fn = descriptor.value;

    descriptor.value = function() {
      let value = fn.apply(this, arguments);
      postal.channel(channel || target.channel || "/").publish(topic, value);
    };
  };
}

import publish from "path/to/decorators/publish";

class FooComponent {
  @publish("foo.some.message", "component")
  someMethod() {
    return {
      my: "data"
    };
  }
  @publish("foo.some.other")
  anotherMethod() {
    // ...
  }
}

let foo = new FooComponent();

foo.someMethod() // 在"component"频道发布"foo.some.message"事件，附带的数据是{ my: "data" }
foo.anotherMethod() // 在"/"频道发布"foo.some.other"事件，不附带数据
```
#### 6.Mixin
#### 7.Trait
#### 8.其他
***
### 类class  
[toTop](#es6学习)  
#### 1.基本使用
1. 类似构造函数
2. 内部constructor类似构造函数，方法类似原型
3. 不能声明提前，多种声明方式（类似函数）
4. name为类后的名字而不是类名
5. 实例化必须使用new
6. ‘原型方法’对外不可见Object.keys不能枚举
7. 使用解构赋值可能使this丢失

```JavaScript
var Person = class SomeOne {}
console.log(Person.name) // SomeOne

class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

#### 2.继承及原生构造函数继承
使用extends实现继承
```JavaScript
class ColorPoint extends Point {}
```
继承（执行父类构造器）super(arg)，super相当于执行父类相关方法，如重写父类一些方法
```JavaScript
class Child extends Parent {
	constructor (x, y, z) {
		super(x, y) // 调用父类constructor
		this.parent = z
	}
	getSome () {
		return this.parent + super.getSome() // 调用父类getSome方法
	}
}
```
> 子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。当然子类可以不需要构造器，这样也不必执行super  
> 当然子类的constructor中未执行super前是不能访问this的

#### 3.getter与setter
可以使用get set关键字代理属性，注意这里的代理没Proxy好用，因为这种代理只是起到拦截作用，所以稍有不慎会报错
```javaScript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}
```
#### 4.类的Generator

#### 5.Class的静态方法
> 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。

优点： 有些方法没必要暴露给实例，静态方法是个非常不错的选择，调用时就不要使用this了直接xx就行
缺点： 偶尔可能会混乱了，毕竟还可以继承
#### 6.静态属性与实例属性
直接写（注意babel设置），类与实例都能访问，每次实例化都会重写属性
#### 7.类的私有属性
类似静态属性的用法，不过变量名前加#
#### 8.new.target
#### 9.Mixin模式的实现
```
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```
***
### 模块module  
[toTop](#es6学习)  
#### 1.概述
> 在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。**前者用于服务器(require)**，**后者用于浏览器(import)**。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。  
ES6 模块的设计思想，**是尽量的静态化**，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。*CommonJS 和 AMD 模块，都只能在运行时确定这些东西*。比如，CommonJS 模块就是对象，输入时必须查找对象属性。  

ES6 可以 **在编译时就完成模块加载**，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为 **它不是对象**  
ES6 模块默认是严格模式，因此注意那些不能使用的语法

#### 2.export于import
1. export只能以接口形式导出模块,因此1）可以同时导出多个；2）导出的是一个模块（接口s），而不是一个值更不是一个对象；3）接口能被使用（拥有标识符）
```JavaScript
// 导出的是接口
var a = {}
export a // error 不是对象

var a = {}
export {a} // ok

export function () {} // error 无标识符无法import

export function a () {} // ok

// 导出多个
// a.js
export function a () {}
export function b () {}
// b.js
import {a, b} from './a.js'

// 一次性d导出多个
var a = {}
function b () {}
export {a, b}
```
2. export能导出多个接口，这些接口必须有标识符，并且在import时对应相应的接口名，当然我们可以更换  
```JavaScript
// a.js
var a = {}
function b () {}
export {a as A, b as B}
// b.js
import {A, B} from './a.js'

// a.js
var a = {}
function b () {}
export {a, b}
// b.js
import {a as A, b as B} from './a.js'
```
3. 在import时可以聚合所有接口
```JavaScript
// a.js
var a = {}
function b () {}
export {a, b}
// b.js
import * as Obj from './a.js'
//Obj.a Obj.b
```
4. export default可以导出一个默认模块，意味着函数可以没有标识符，导出的模块是一个对象;import时可以指定任意名称
```JavaScript
var a = {}
export default a // ok

export default function () {}
```
5. import进入的资源是不允许修改的
```JavaScript
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {};
```
6. 可以同时export import自己 再export自己，不过感觉没啥用，主要是为了在此命名封装吧
7. 有了6，我们还可以继承模块，导出另一个模块再为之添加一些接口
```JavaScript
// circleplus.js
export * from 'circle'; // 继承了circle所有接口
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```
8. import不能动态，但是import()可以，而且是异步的（有then方法）
***
### es6模块与其他模块区别  
[toTop](#es6学习)  
#### es6与common.js区别
> CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。  
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

这也意味着使用common（module.exports = {}）导出一个模块，在第一次require后就会执行导出的对象，并缓存在内存里（挂载在exports下），如果再此被require就会直接取用内存中保存的值，更像是值的副本  
而es6模块在被import只会拿到引用，在运行到import的接口只会根据引用动态拿数据，这也是为什么es6模块不能被赋值的原因，是一个只读的接口  

在es6中，如果通过module.exports = {}导出模块再使用import引入，node会（版本OK的话）自动将其转为export default  
同理，通过es6导出的模块使用require引入则会将导出接口变为同名属性，变为common.js模块

#### amd
amd模块定义很简单
```JavaScript
define(
    module_id /*可选*/,
    [dependencies] /*可选*/,
    definition function /*用来初始化模块或对象的函数*/
);
define('myModule',
    ['foo', 'bar'],
    // 模块定义函数
    // 依赖项（foo 和 bar）被映射为函数的参数
    function ( foo, bar ) {
        // 返回一个定义了模块导出接口的值
        // （也就是我们想要导出后进行调用的功能）

        // 在这里创建模块
        var myModule = {
            doStuff:function(){
                console.log('Yay! Stuff');
            }
        }

        return myModule;
});
require(['foo', 'bar'], function ( foo, bar ) { // 模块id
        // 这里写其余的代码
        foo.doSomething();
});
```
看到没，颇有angular之风，不对，angular就是照这个来的，因为在node中不需要这些（毕竟是在服务端跑的，文件都是同步的）而浏览器中是异步的，为了防止模块还没加载进来就需要等模块加载完再异步执行代码
