## 防抖（debounce）
防抖指的是在通过某种方式使一个连续**触发**的动作在**一段时间内只执行一次**。当这个动作触发的时候，延时n毫秒**执行**，如果在这个时间段中这个动作还被触发，则重置延时的时间为n。

### 1.最简单的版本
- 延时n毫秒执行
- 重置延时时间

```js
function debounce(func, wait) {
  let timer = null;
  function debounced(...args) {
    const context = this; //防抖不能影响方法的this
    const params = args;
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(context, params);
      clearTimeout(timer);
      timer = null;
    }, wait);
  }
  return debounced;
}
```  

### 2.头尾都可以执行的版本
在某些防抖的场景中，需要在动作触发的时候就**立即执行一次**，然后再延时n毫秒执行。这就需要提供一个参数来控制执行的动作执行的时机。

#### lodash中leading和tailing参数的规范
1. leading==false  tailing==true : 尾执行（默认情况）
2. leading==true  tailing==true : 头尾都执行(尾执行需要在**动作触发大于一次**的情况下)
3. leading==true  tailing==false : 头执行
4. leading==false  tailing==false : 这种场景没有意义，走默认场景

```js
function debounce(func, wait, options = { leading: false, tailing: true }) {
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
    if (options.tailing && params) {
      startTimer(() => {
        invokeFunc();
        timer = null;
      });
    }
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
  return debounced;
}
```  

### 3.更加完善的版本
1. 增加取消的接口(cancel)
2. 增加理解执行的接口(flush)

```js
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
```  

### lodash中debounce源代码解析
这篇文章解析得很详细了
[传送门](https://muyiy.cn/blog/7/7.4.html#%E5%BC%95%E8%A8%80)

#### lodash额外的功能
1. 当wait没有设置的时候，**wait是undefined（没有给默认值0）**,lodash中使用requestAnimationFrame来代替setTimeout来延时
2. lodash增加了一个maxWait参数，**表示两次执行func的最大时间间隔**，换句话是就是间隔maxWait之后必须在执行一次func。这个参数是给throttle用的，lodash中的throttle是借助debounce来实现的
3. lodash中多处使用时间戳的方式来计时，时间间隔会更加准确。但是造成临时变量过多，读起来需要花点时间理解，我这里没有使用这种方式。



















