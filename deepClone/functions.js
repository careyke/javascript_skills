/**
 * 深拷贝主要是针对引用类型
 * js中引用类型很多,Object Array,Map,Set 这几种都需要特殊处理
 * 这里仅以只包含值类型和Object的对象为例子分析
 */

/**
 * 判断变量类型是否为对象
 * @param {*} variable 
 */
const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

/**
 * 构造伪数据
 * @param {*} depth 深度
 * @param {*} range 广度
 */
const createMockObject = (depth, range) => {
  const res = {};
  let temp = res;

  for (let i = 0; i < depth; i++) {
    for (let j = 0; j < range; j++) {
      temp[j] = j;
    }
    temp.data = {}
    temp = temp.data;
  }
  return res;
}

/**
 * 递归完成深拷贝
 * @param {*} source 
 */
const cloneByRecursion = (source) => {
  const res = {};
  for (let key of source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key])) {
        res[key] = cloneByRecursion(source[key]);
      } else {
        res[key] = source[key];
      }
    }
  }
  return res;
}

/**
 * JSON序列化完成深拷贝
 * @param {*} source 
 */
const cloneByStringify = (source) => {
  return JSON.parse(JSON.stringify(source));
}

/**
 * 使用循环实现深拷贝
 * 可以防止爆栈
 * @param {*} source 
 */
const cloneByLoop = (source) => {
  const stack = [];
  const result = {};
  stack.push({
    target: result,
    data: source
  });

  while (stack.length > 0) {
    const node = stack.pop();
    const { target, data } = node;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          target[key] = {};
          stack.push({
            target: target[key],
            data: data[key]
          });
        } else {
          target[key] = data[key];
        }
      }
    }
  }
  return result;
}

/**
 * 循环的方式来解决深拷贝
 * 可以解决相同引用丢失和循环引用的问题
 * @param {} source 
 */
const cloneByLoopKeepQuote = (source) => {
  const stack = [];
  // 这里使用Map来作为缓存，因为Map可以使用object作为key值
  const uniqueCacheMap = new Map();
  const result = {};
  stack.push({
    target: result,
    data: source
  });

  while (stack.length > 0) {
    const node = stack.pop();
    const { target, data } = node;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        if (isObject(value)) {
          if (uniqueCacheMap.get(value)) {
            target[key] = uniqueCacheMap.get(value);
          } else {
            target[key] = {};
            uniqueCacheMap.set(value, target[key]);
            stack.push({
              target: target[key],
              data: value
            });
          }
        } else {
          target[key] = value;
        }
      }
    }
  }
  return result;
}