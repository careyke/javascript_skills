## 快速排序

### 特点
1. 时间复杂度是O(nlogn),效率比较高
2. 空间复杂度看具体的实现

### 思想
[看这边文章分析的思想](https://juejin.im/post/5d75b4d45188250c992d5919)

简单来说就是：先找一个基准值，然后把其他所有值都和这个值对比，大于它的放在右边，小于它的放在左边，然后左右两边按照这个思想递归。

### 实现
#### 1.空间复杂度不好看，但是很好理解
```js
function quickSort(nums = []) {
  const len = nums.length;
  if (nums.length <= 1) return nums;
  const pivotIndex = len >>> 1;
  const pivot = nums[pivotIndex];
  const left = [], right = [];
  nums.forEach((n, index) => {
    if (index === pivotIndex) return;
    if (n <= pivot) {
      left.push(n);
    } else {
      right.push(n);
    }
  })
  return [...quickSort(left), pivot, ...quickSort(right)];
}
```  
时间复杂度符合要求，但是空间复杂也是O(nlogn)(可能更大)，不合要求。但是代码一目了然，很好理解

#### 2.空间复杂度和时间复杂度都很好的解法（看注释）
```js
function quickSortOptimization(nums = []) {
  const exchange = (left, right) => {
    const temp = nums[left];
    nums[left] = nums[right];
    nums[right] = temp;
  }
  const quickSort = (nums, left, right) => {
    if (left > right) return; //跳出递归
    let leftCopy = left, rightCopy = right;
    let pivotIndex = left;
    const pivot = nums[pivotIndex];
    while (left < right) {
      // 从右往左找，找到第一个小于基准值的值，然后和基准值换位置，相当于将这个小于基准值的值放在基准值的左边
      while (left < right) {
        if (nums[right] < pivot) {
          exchange(pivotIndex, right);
          pivotIndex = right;
          break;
        }
        right--;
      }
      // 从左往右找，找到第一个大于基准值的值，然后和基准值交换位置，相当于将这个大于基准值的值放在基准值右边
      while (left < right) {
        if (nums[left] > pivot) {
          exchange(left, pivotIndex);
          pivotIndex = left;
          break;
        }
        left++;
      }
      right--; //此时right位置上的值肯定大于或等于pivot,这里做一次减减操作，可以优化循环的次数
    }

    //递归执行
    quickSort(nums, leftCopy, pivotIndex - 1);
    quickSort(nums, pivotIndex + 1, rightCopy);
  }

  //入口方法
  quickSort(nums, 0, nums.length - 1);
  return nums;
}
```  
算法实现思路：总体来说是一种**边找变替换**的解法。假设**0位置为基准值，则需要先从后往前找（如果以最后一个位置为基准值，则需要先从前往后找。）**，找到一个小于pivot的值，交换位置。然后再从前往后找，找到一个大于pivot的值，交换位置。循环执行，最终就可以达到pivot左边的数小于它，右边的数大于它。最后再分片递归即可。

这种解法效率更高，但是阅读成本就比较高了。

### 参考链接
[传送门](https://blog.csdn.net/xuyangxinlei/article/details/81062015)