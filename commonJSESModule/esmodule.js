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
