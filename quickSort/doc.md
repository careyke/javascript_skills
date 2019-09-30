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
时间复杂度符合要求，但是空间复杂也是O(nlogn)，不合要求。但是代码一目了然，很好理解