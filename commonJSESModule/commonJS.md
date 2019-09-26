## 利用webpack学习CommonJS和ESModule
因为webpack**支持web使用CommonJS规范模块化代码**，所以可以通过分析**被webpack编译过后的nodejs代码**来了解nodejs底层是如果来实现CommonJS模块化规范的（直接分析nodejs源码难度有点大）。同时也可以通过分析**被webpack编译过的ESModule代码**来分析ESModule的特征。
### CommonJS
使用的require/exports来导入和导出。
#### nodejs代码
```js
// lib.js
exports.a = 1;
exports.b = 2;

module.exports = function(a,b){
  return a+b;
}

setTimeout(()=>{
  console.log(exports);
  console.log(module.exports);
},2000)

// index.js
const lib = require('./lib');
console.log(lib);
lib.b= 3;
```  

#### webpack编译后的nodejs代码（看中文注释）
```js
(function (modules) { // webpackBootstrap
  // The module cache
  var installedModules = {}; //模块缓存Map,避免二次访问的开销

  // The require function
  // 导入其他模块的方法
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;

    }
    // Create a new module (and put it into the cache)
    // 初始化一个新的模块
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {} //模块中的this变量

    };

    // Execute the module function
    // 可以看到这里将module和module.exports都传到了模块代码作用域中
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports; //最后导出的就是module.exports

  }


  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });

    }

  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    }
    Object.defineProperty(exports, '__esModule', { value: true });

  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;

  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;

  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";


  // Load entry module and return exports
  // 模块化入口
  return __webpack_require__(__webpack_require__.s = "./index.js");

})
  /************************************************************************/
  //可以看到，每一个模块就是一个立即执行函数，因为要有自己的独立局部作用域
  //然后所有的模块形成一个映射表
  ({

    "./index.js":
      (function (module, exports, __webpack_require__) {

        const lib = __webpack_require__("./lib.js");
        console.log(lib);
        lib.c = 3;


      }),

    "./lib.js":
      (function (module, exports) {

        exports.a = 1;
        exports.b = 2;

        module.exports = function (a, b) {
          return a + b;
        }

        setTimeout(() => {
          console.log(exports);
          console.log(module.exports);
        }, 2000)

      })
  });
```  
虽然nodejs的底层可能和webpack实现的有差别，但是思想是一样的，不妨碍我们通过webpack的编译代码来理解nodejs底层对CommonJS规范的实现。

**分析编译后的代码可以看出**：
1. **webpack内部其实实现了一套CommonJS规范的模块化机制**。
2. 一个文件就是模块，系统会为**每一个模块生成一个模块对象**，并且挂载在全局的modules对象中，用来缓存，避免二次开销。
3. 每一个模块经过编译之后都**会生成一个function函数，函数的执行体就是模块中的内**容，生成function是为了为模块构造一个独立的作用域，并且可以通过function将module对象传进去进行操作。nodejs中出了传module,module.exports,require之外，还有__filename和__dirname
4. 可以看出最终导出的是module.exports，所以使用module.exports导出的时候会覆盖exports导出的内容

#### CommonJS的一些特性
1. CommonJS输出的是一个**值的拷贝**。在使用module.exports={}导出对象的时候，都是将要导出的内容暂存在这个对象上的，如果**内部的导出属性发生改变的时候（不包含改变对象中的属性），是不会影响到导出对象的，也就是外部感知不到的**（语言组织不太好，代码分析一下就知道了）
2. CommonJS是**运行时加载的**，也就是说每次加载的时候都必须要运行整个模块才可以得到导出对象。也就是说是**整体加载的，无法实现按需加载**。

#### node底层的一些实现
1. node中的文件也是会有一个编译的过程的，在编译的过程中将文件进行包装成一个function,然后注入相应的模块级别的参数。



### ESModule的特点分析
ESModule是ES6新提出的模块化方案，但是目前浏览器还不支持直接使用，需要使用babel等工具来转成es5的代码带可以执行。所以我们可以通过分析webpack编译后的代码来分析ESModule的一些特性，并且和CommonJS做一个对比。（**webpack编译后的ESModule并不是原生ESModule真正的实现，只是模拟其部分特性**）

*感觉上webpack是通过CommonJS的实现方式，再加上一些ESModule的属性来模拟ESModule的*。

#### 看一下babel编译后的代码
```js
// ES6的代码
import {fun,obj} from './utils';
const {m,n} = obj;
export const add =(a,b)=>{fun(a,b);return m+n}
```  

```js
// babel编译后的代码
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = void 0;

var _utils = require("./utils");

var m = _utils.obj.m,
    n = _utils.obj.n;

var add = function add(a, b) {
  (0, _utils.fun)(a, b);
  return m + n;
};

exports.add = add;
```  
对比两份代码：
1. babel会将ESModule的代码编译成CommonJS，但是还是无法直接使用模块化的，因为**缺少模块的管理和调度机制**，将所有的模块组装起立。
2. 需要依靠webpack来管理和调度所有的模块，使其最终可以正常运作。

#### webpack编译的代码（看中文注释）
```js
// 源代码
// utils.js
export const add = (a, b) => {
  return a + b;
}

// index.js
import { add } from './utils';

console.log('add', add(1, 2))
```  

```js
// webpack编译后的代码
(function (modules) { // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {

    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    // 如果是新的模块，新建一个模块对象，挂载在installedModules中，用来缓存导出结果
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    // Execute the module function
    // 传入模块对象，执行模块内的代码，并且将模块的导出代码收集在这个模块对象上。
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }


  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  // 将模块中导出的部分挂载在module.exports对象中，而且设置成是只读的属性，不允许外部修改
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function (value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

  // __webpack_public_path__
  __webpack_require__.p = "";


  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "./esModule/index.js");
})
  /************************************************************************/
  // 模块路径和包装好的函数的映射表
  // 绝对路径是不是更好，相对路径会导致重复加载的吧？？？
  ({

    "./esModule/index.js":
      /*!***************************!*\
        !*** ./esModule/index.js ***!
        \***************************/
      /*! no exports provided */
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./esModule/utils.js");

        // 这里的使用方式需要注意一下
        // es6中我们使用的是import {add} from './utils';有点像是对象的解构赋值，
        // 但是实际上不是的，这里并不会在当前作用域创建一个add临时变量。而是在使用add的地方使用'obj.xxx'的形式使用的
        // 这样做就是在模拟ESModule中的导出的是值的引用这一特性。如果你修改了utils模块中的add，外部是可以取到修改后的add的
        console.log('add', Object(_utils__WEBPACK_IMPORTED_MODULE_0__["add"])(1, 2))

      }),

    "./esModule/utils.js":
      /*!***************************!*\
        !*** ./esModule/utils.js ***!
        \***************************/
      /*! exports provided: add */
      (function (module, __webpack_exports__, __webpack_require__) {

        "use strict";
        __webpack_require__.r(__webpack_exports__);
        /* harmony export (binding) */
        __webpack_require__.d(__webpack_exports__, "add", function () { return add; });
        const add = (a, b) => {
          return a + b;
        }

      })

  });
```  
从中可以分析ESModule的特性：
1. ESModule使用的是**严格模式**
2. ESModule导出的对象中的属性是**只读属性**
3. ESModule**导出的是值的引用**，内部修改外部也会受到影响。看编译后的代码很好得出结论

代码中分析不出来的特性：（webpack编译代码没有模拟出来的特性？？？）
1. ESModule**编译时输出接口**，**JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用**。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。换句话说ESModule是**动态引用**。每次外部使用的时候，动态去模块中获取。
2. ESModule可以支持按需加载，即只加载被引用的部分。可以做到这个也是因为其动态引用的原因
3. ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入，即ES6 模块在编译的时候就完成了模块加载。

### ESModule vs CommonJS
1. CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
2. CommonJS 模块是运行时加载，ES6 模块是**编译时**输出接口。
3. CommonJS 只能全部加载， ES6 模块可以实现按需加载
4. CommonJS 导出的是对象，ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入，即ES6 模块在编译的时候就完成了模块加载。

具体的分析上面多有

### 参考
[传送门](http://es6.ruanyifeng.com/#docs/module-loader)

### tips
大部分浏览器已经支持原生的ESModule了，改天需要去体验一下。

webpack babel这种工具使用的都是降级之后的ESModule，没有实现ESModule的编译器加载模块，还是通过对象实现的。







