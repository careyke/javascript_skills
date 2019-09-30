/**
 * 二分查找
 * 时间复杂度是O(logn)
 * 使用二分查找的前提必须是排序数组，不然的话是没有意义的,这里假设数组是从小到大排序的
 * 二分法的难点是在于结束循环的条件，这里我们可以分成两种区间形式来分析
 * 但是归根到底都是分析当left和right **相邻** 是的情况，应该是倒数第二次循环
 * 1.[left,right]闭区间: left === right 需要再执行一次
 * 2.[left,right)左闭右开区间: left === right 直接退出循环
 */

/**
 * 使用闭区间
 * [left,right]
 */
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

/**
 * 使用半闭半开区间
 * [left,right)
 * @param {*} arr 
 * @param {*} target 
 */
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

// const testArr = [2, 5, 7, 23, 45, 67, 199, 234, 345, 666];
// console.log(binarySearchOpen(testArr, 67));

/**
 * 目标值重复的情况下，获取目标值的区间
 * 使用闭合区间的解法
 * 时间复杂度是2O(logn) = O(logn)
 * @param {*} arr 
 * @param {*} target 
 */
function binarySearchGetInterval(arr, target) {
  const len = arr.length;
  const interval = [-1, -1];
  // 寻找左边边界
  let left = 0, right = len - 1;
  while (left <= right) {
    const mid = (left + right) >>> 1;
    const value = arr[mid];
    if (value === target) {
      interval[0] = mid;
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