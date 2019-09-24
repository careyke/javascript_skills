/**
 * 时间戳版本
 * @param {*} func 
 * @param {*} wait 
 */
function throttleTimeStamp(func, wait = 0) {
  let lastInvokeTime = 0;
  let result = null;
  function throttled(...args) {
    const context = this;
    const callTime = Date.now();
    if (callTime - lastInvokeTime > wait) {
      lastInvokeTime = callTime;
      result = func.apply(context, args);
    }
    return result;
  }
  return throttled;
}

/**
 * setTimeout版本
 * @param {*} func 
 * @param {*} wait 
 */
function throttleTimeout(func, wait = 0) {
  let result = null;
  let timer = null;
  function throttled(...args) {
    const context = this;
    if (!timer) {
      timer = setTimeout(() => {
        result = func.apply(context, args);
        timer = null;
      }, wait)
    }
    return result;
  }
  return throttled;
}

/**
 * 可配置的节流
 * @param {*} func 
 * @param {*} wait 
 * @param {*} options 
 */
function throttle(func, wait = 0, options = {}) {
  let result = null;
  let lastInvokeTime = 0; //上次调用func的时间
  let lastCallTime = 0; //上次调用throttled的时间
  let params = null;
  let context = null;
  let timer = null;

  // 初始化options，leading和tailing同时为false的场景几乎没有
  if (options.leading === undefined) options.leading = true;
  if (options.tailing === undefined) options.tailing = true;
  if (options.leading === false && options.tailing === false) {
    options.leading = true;
    options.tailing = false;
  }

  /**
   * 执行func
   */
  const invokeFunc = () => {
    lastInvokeTime = Date.now();
    result = func.apply(context, params);
    params = null;
    context = null;
  }

  /**
   * 执行leading
   * 1.options.leading === true;
   * 2.相邻两次的callTime间隔大于wait
   */
  const invokeLeading = (callTime) => {
    if (options.leading) {
      if (callTime - lastCallTime >= wait) {
        lastInvokeTime = 0;
      }
    } else {
      lastInvokeTime = callTime;
    }
    lastCallTime = callTime;
  }

  const cancel=()=>{
    if(timer){
      clearTimeout(timer);
    }
    timer = null;
    context = null;
    params = null;
    lastCallTime = 0;
    lastInvokeTime = 0;
    result = null;
  }

  /**
   * 入口函数
   * @param  {...any} args 
   */
  function throttled(...args) {
    params = args;
    context = this;
    const callTime = Date.now();
    invokeLeading(callTime);
    const remainTime = wait - (callTime - lastInvokeTime);
    //使用throttle time stamp, 但是一旦达到执行条件，需要清空定时器,防止多余执行
    if (remainTime <= 0 || remainTime > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invokeFunc();
    } else if (options.tailing && params && !timer) {
      //使用throttle setTimeout,
      //但是要注意当tailing触发的时候，表示本次节流已经完成，需要重置lastInvokeTime
      //params不存在的时候不设置tailing执行，因为本次执行func的结果必和上次一样，没有必要执行两次
      timer = setTimeout(() => {
        invokeFunc();
        timer = null;
      }, remainTime);
    }
    return result;
  }
  throttled.cancel = cancel;
  return throttled;
}

function handle(e) {
  console.log(e);
}

window.addEventListener('resize', throttle(handle, 2000));