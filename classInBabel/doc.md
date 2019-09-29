## Class In Babel
class是es6引入的定义类的一种方式，但是js中本身是不存在类的，es6之前的类都是使用函数来实现的。**class本质上是一种定义类的语法糖，其底层仍然使用的是函数**。

这里来学习一下babel对于class的实现

### class代码
```js
class Animal{
	constructor(type){
    	this.type = type;
    }
    shout(){
    	console.log('Animal call');
    }
    static isAnimal(){
        console.log(true)
    }
}

class Cat extends Animal{
    constructor(name){
        super('cat');
        this.name = name;
    }
    shout(){
        super.shout();
    	console.log('cat miao!');
    }
}
const cat = new Cat('Tom');
console.log(cat.type,cat.name);
cat.shout();
```  
### babel的实现（看中文注释）
```js
"use strict";

// for Symbol polyfill
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}

// 处理在构造函数里面return其他值的情况
// 查看构造函数里面return的规则
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/**
 * Reflect polyfill 学习了
 * 在整个原型链中获取某个属性的方法
 * @param {*} target 
 * @param {*} property 
 * @param {*} receiver 
 */
function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

/**
 * 获取object的原型链中真正持有property的对象
 * @param {*} object 
 * @param {*} property 
 */
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

/**
 * Object.setPrototypeOf polyfill
 * @param {*} o 
 */
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/**
 * 类继承的关键代码
 * 采用的是组合寄生式的继承
 * 1.subClass.prototype.__proto__ = superClass.prototype
 * 2.subClass.__proto__ = superClass 这里是为了获取superClass中的实例属性。一般实现这里会直接调用SuperClass的构造方法获取
 * SuperClass.call(this);
 * @param {*} subClass 
 * @param {*} superClass 
 */
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

/**
 * Object.setPrototypeOf polyfill
 * @param {*} o 
 * @param {*} p 
 */
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _instanceof(left, right) {
  // es6对象中内置的方法,instanceof 运算符的内部实现
  // foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)
  // 可以被重写
  if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

/**
 * 判断是否是通过new运算符调用class
 * 不允许将class当做函数使用
 * 通过this判断
 * @param {*} instance 
 * @param {*} Constructor 
 */
function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * 使用defineProperty定义属性
 * @param {*} target 
 * @param {*} props 
 */
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

/**
 * 定义属性和方法
 * 1.成员方法定义在原型上
 * 2.静态方法定义在构造函数上
 * @param {*} Constructor 
 * @param {*} protoProps 
 * @param {*} staticProps 
 */
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * class本质上仍是function
 */
var Animal =
  /*#__PURE__*/
  function () {
    function Animal(type) {
      _classCallCheck(this, Animal);
      // 定义实例属性
      this.type = type;
    }
    // 定义成员方法和静态方法
    _createClass(Animal, [{
      key: "shout",
      value: function shout() {
        console.log('Animal shout');
      }
    }], [{
      key: "isAnimal",
      value: function isAnimal() {
        console.log(true);
      }
    }]);

    return Animal;
  }();

// 利用立即执行函数，传入父类
var Cat =
  /*#__PURE__*/
  function (_Animal) {
    // var变量提升 function提升
    _inherits(Cat, _Animal);

    function Cat(name) {
      var _this;

      _classCallCheck(this, Cat);

      // _getPrototypeOf(Cat) 配合_inherits中的subClass.__proto__ = superClass操作
      // 获取父类的构造函数 最终是调用Animal.call(this,'cat')
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Cat).call(this, 'cat'));
      _this.name = name;
      return _this;
    }

    _createClass(Cat, [{
      key: "shout",
      value: function shout() {
        _get(_getPrototypeOf(Cat.prototype), "shout", this).call(this);

        console.log('cat miao!');
      }
    }]);

    return Cat;
  }(Animal);

var cat = new Cat('Tom');
console.log(cat.type, cat.name);
cat.call();
```  
虽然看起来代码有很多行，很复杂。但是其中有很多是为了兼容性而对一些方法做的polyfill。
#### 分析
1. babel采用的仍然是组合寄生的继承。
2. 子类在使用父类的实例属性时有略微不同，具体看上面代码中的注释。
3. 每一个类都是用一个立即执行函数包裹，父类通过函数参数的形式传入闭包中。
