## 节流
对于一个连续触发的函数，保证在**n毫秒内最多执行一次**。即在连续触发的过程中，每过n毫秒执行一次

### 最简单的版本

#### 时间戳版本（头执行，尾不执行）
使用时间戳的方式来计算间隔时间
```js
function throttleTimeStamp(func, wait = 0) {
  let lastInvokeTime = 0; //上次调用func的时间
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
```  
特点：
1. 开始会执行一次func，然后开始定时执行
2. 事件停止触发之后，func也就不会再执行

#### setTimeout版本（头不执行，尾执行）
使用setTimeout来定时执行，不需要计算时间间隔
```js
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
```  
特点：
1. 节流开始不会先执行一次func
2. 时间停止触发之后，会再执行一次func

### 综合的版本（不是最完美的，但是很好理解，而且基本可以覆盖所有场景）
在一些场景中，需要实现头执行和尾执行的可配置，leading表示头执行，tailing表示尾执行。
1. leading==false  tailing==true : 尾执行
2. leading==true  tailing==true : (**默认场景**)头尾都执行(尾执行需要在**动作触发大于一次**的情况下)
3. leading==true  tailing==false : 头执行
4. leading==false  tailing==false : 头尾都不执行，这种场景几乎没有，直接走默认场景。lodash中的throttle有实现,这里实现的是underscore的版本

这里综合的版本是上面的**时间戳版本**和**setTimeout版本**的**结合产物**。

```js
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
      lastInvokeTime = callTime; //避免leading执行
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
```  

#### 一些理解
1. 在leading和tailing都为true的时候，如果tailing执行完之后算是本次节流执行完成。但是立即开始下一轮的节流的时候，如果wait时间比较大，是不会立刻执行leading的。在新一轮节流开始的时候，需要<u>**对比上一轮最后一个执行throttled的时间**</u>，如果间隔大于等于wait就执行leading，如果小于的话就走计算remainTime的逻辑。就算是lodash也是这个逻辑。当然如果wait比较小的时候是基本体会不出来的，现实应用在绝大部分的场景wait时间是比较小的。（最完美的解决方案并没有想到，**尝试过在setTimeout中重置lastInvokeTime,但是导致了其他问题**。因为setTimeout中的func是有可能在节流的中间执行的，比如在某个时候remainTime为1，则setTimeout中的func会先执行，如果这个时候重置lastInvokeTime,会导致下一个触发throttled也会执行func,相当于同时执行两次）
2. 这个版本就是通过**时间戳版本和定时器版本拼凑而成**，时间戳版本实现leading=true,tailing=false的情况，计时器版本实现leading=false,tailing=true版本。

### lodash版本的额外功能
1.lodash版本中支持leading=false tailing=false的参数，尽管基本没有这种场景，但是还是可以运行func，我们上面实现的版本无法做到
2. lodash中的throttle是在debounce的基础上实现的，代码重用很高

















