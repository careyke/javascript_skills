/**
 * 快速排序
 * 时间复杂度是O(nlogn)
 * 重要的是快速排序的思想
 */

/**
 * 这种实现空间复杂度比较大
 * 优化：需要在同一个数组进行替换操作，减少空间复杂度
 * @param {*} nums 
 */
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

/**
 * 优化之后的快排算法
 * 在一个数组中作业，每次递归只开辟常量空间复杂度，不新开辟数组。
 * 由于是递归，在递归函数中空间复杂度是O(1),但是由于递归栈的存在，临时变量一直不销毁，空间复杂度大概是O(logn)
 * @param {*} nums 
 */
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