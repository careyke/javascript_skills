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