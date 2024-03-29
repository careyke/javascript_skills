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
