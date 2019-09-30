## 二分查找
### 二分查找的特点
1. 二分查找必须作用在**排序数组**中，作用在没有排序的数组中是没有意义的
2. 时间复杂度是O(logn)

### 难点
二分查找的难点在于对边界条件的判断，很多时候不知道啥时候退出循环。但是其实最终在判断临界条件的时候，都是在**判断left和right相邻时**的情况。

#### 两种方法
1. 使用闭合区间：[left,right],这时需要计算left===right的情况，所以循环条件为while(left<=right);
2. 使用左闭右开区间：[left,right)，这时不需要计算left === right的情况，所以循环条件为while(left<right);

### 查找某一个元素
#### 1.闭区间
```js
function binarySearchClose(arr, target) {
  const len = arr.length;
  let left = 0, right = len - 1;
  while (left <= right) {
    let mid = (left + right) >>> 1; //这里使用无符号位运算，性能稍好 = Math.floor((right+left)/2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      right = mid - 1; //因为是闭区间，区间缩小之后也需要是闭区间
    } else {
      left = mid + 1;
    }
  }
  return -1;
}
```  

#### 2.左闭右开区间
```js
function binarySearchOpen(arr, target) {
  const len = arr.length;
  let left = 0, right = len;
  while (left < right) { // 因为right是开区间，所以当left === right时就需要退出
    const mid = (left + right) >>> 1;
    const midValue = arr[mid];
    if (midValue === target) {
      return mid;
    } else if (midValue > target) {
      right = mid; // 因为是右边是开区间，所以不需要减1
    } else {
      left = mid + 1;
    }
  }
  return -1;
}
```  

### 目标值重复的情况下，获取目标值的区间
两种方式都可以用下面这种方式，中途记录value=target的下标值，然后往某一个方向推进。
```js
function binarySearchGetInterval(arr, target) {
  const len = arr.length;
  const interval = [-1, -1];
  // 寻找左边边界
  let left = 0, right = len - 1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    const value = arr[mid];
    if (value === target) {
      interval[0] = mid; //记录value的target的下标值
      right = mid - 1; //闭区间的时候，这里使用right = mid 会造成死循环
    } else if (value > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  // 寻找右边界
  left = 0;
  right = len - 1;
  while(left <= right){
    const mid = (left + right) >>> 1;
    const value = arr[mid];
    if (value === target) {
      interval[1] = mid;
      left = mid + 1; //闭区间的时候，这里使用right = mid 会造成死循环
    } else if (value > target) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return interval;
}
```  

### 参考
[传送门](https://juejin.im/post/5d8f6856e51d45784227aca6?utm_source=gold_browser_extension#heading-1)



















