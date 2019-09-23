/**
 * 判断是否为对象
 * isObject({}) //true
 * isObject(()=>{}) //true;
 * isObject(null) // false
 * @param {*} value 
 */
const isObject = (value) => {
  const type = typeof value;
  return !value && (type === 'object' || type === 'function');
}


function debounce(func, wait = 0, options = { leading: false, tailing: true }) {
  let timer = null;
  let result = null;
  let context = null;
  let params = null;

  // leading和tailing同时为false是没有意义的
  if (options.leading === false && options.tailing === false) {
    options.tailing = true;
  }

  /**
   * 执行真实函数
   * 清空临时变量
   */
  const invokeFunc = () => {
    result = func.apply(context, params);
    context = null;
    params = null;
    context = null;
  }

  /**
   * 开启定时器
   * leading和tailing都需要开启定时器
   * @param {*} callback 
   */
  const startTimer = (callback) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, wait);
  }

  /**
   * 调用leading时机的invokeFunc函数
   */
  const invokeLeading = () => {
    if (!timer && options.leading) {
      invokeFunc();
      startTimer(() => { timer = null });
    }
  }

  /**
   * 调用tailing时机的invokeFunc函数
   */
  const invokeTailing = () => {
    // params不存在的时候说明leading为true,且debounced只执行了一次
    if (options.tailing && params) {
      startTimer(() => {
        invokeFunc();
        timer = null;
      });
    }
  }

  /**
   * 判断是否处于延时期间
   */
  const pending = () => {
    return timer !== null;
  }

  /**
   * 取消debounce
   */
  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = null;
    context = null;
    params = null;
  }

  /**
   * 入口方法
   * @param  {...any} args
   */
  function debounced(...args) {
    context = this;
    params = args;
    invokeLeading();
    invokeTailing();
    return result;
  }
  debounced.pending = pending;
  debounced.cancel = cancel;
  return debounced;
}

function handle(e) {
  console.log(e);
}

window.addEventListener('resize', debounce(handle, 1000, { leading: true, tailing: false }));