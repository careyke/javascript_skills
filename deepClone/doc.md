## 深拷贝的解决办法
对于引用类型来说，有深拷贝和浅拷贝的区分。浅拷贝只会复制对象第一层，深拷贝可以**递归复制**对象的所有层次。

### 深拷贝的工具方法
#### 判断是否是对象
```js
/**
 * 判断变量类型是否为对象
 * @param {*} variable 
 */
const isObject = (variable) => {
  return Object.prototype.toString.call(variable) === '[object Object]';
}
```  

#### 生成测试对象
```js
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
```  

### 实现深拷贝的要点
#### 1.保留相同引用
```js
let a={s:12};
let b={b1:a,b2:a};
b.b1 === b.b2 // true

let c = deepCopy(b);
// 需要保持引用相同
c.b1 === c.b2 // true;
```  

#### 2.解决循环引用
```js
let a={};
a.b = a;

let c = deepCopy(a); // 不会时间限制
```  

#### 3.解决爆栈风险

### 实现深拷贝的方式
#### 1.递归实现
```js
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
```  
##### 优点
1. 实现简单

##### 缺点
1. 递归实现有爆栈的风险
2. 没有保留相同引用
3. 没有解决循环引用

#### 2.JSON序列化实现
```js
/**
 * JSON序列化完成深拷贝
 * @param {*} source 
 */
const cloneByStringify = (source) => {
  return JSON.parse(JSON.stringify(source));
}
```  
##### 优点
1. 代码简洁
2. 没有爆栈风险

##### 缺点
1. 需要先序列化再反序列化，性能不是很好
2. 没有保留相同引用
3. 没有解决循环引用
4. 有一些数据类型无法正常复制(undefined,function)

#### 3.循环实现
使用循环来替代递归，防止爆栈
```js
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
```  

##### 优点
1. 不会爆栈

##### 缺点
1. 没有保留相同引用
2. 没有解决循环引用

#### 4.循环实现且缓存引用映射表
```js
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
```  
##### 优点
1. 不会爆栈
2. 保留了相同引用
3. 解决了循环引用

##### 缺点
1. 需要付出额外的空间成本

### 参考文章
1. [深拷贝的终极探索](https://segmentfault.com/a/1190000016672263#articleHeader4)











