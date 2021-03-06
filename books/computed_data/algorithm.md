## 算法
**基础**
* [算法复杂度描述](#算法复杂度描述)
* [排序算法](#排序算法)
  * [冒泡排序](#冒泡排序)
  * [选择排序](#选择排序)
  * [插入排序](#插入排序)
  * [总结](#总结)
* [去重算法](#去重算法)
* [检索算法](#检索算法)

**高级**
* [高级排序算法](#高级排序算法)
  * [快速排序](#快速排序)
  * [堆栈排序](#堆栈排序)
  * [归并排序](#归并排序)
  * [希尔排序](#希尔排序)
  * [计数排序](#计数排序)
  * [桶排序](#桶排序)
  * [排序算法总结](#排序算法总结)


### 算法复杂度描述
对于一个算法，我们一般会去做两步分析，即正确性分析和复杂度分析  
算法的复杂度包括时间复杂度和空间复杂度  
时间复杂度是指一个算法与算法完成时间的关系；空间复杂度则是算法与算法消耗存储空间的关系  
我们主要探讨的是时间复杂度  
通常用T(n)=O(f(n))表示，具体指n为问题的规模（我们设定它为无穷大），f为算法，O为一个常数  
比如完成一个算法需要n步，那么复杂度为O(n);需要2步（与n无关），那么就是O(1)  
记住我们假设了n为无穷大，O表示一个常数，所以需要2步即O(1)  
另外数量级相同我们也认为复杂度一致，如
2n^2+2 == n^2

### 排序算法
排序主要是针对数组数据的排序，在基础排序算法主要包含三种算法，冒泡排序，插入排序，选择排序

#### 冒泡排序
冒泡排序的核心思路是最值像冒泡一样总会到一端。如从小到大。第一次遍历会让最大值到数组最右端，第二次遍历会让第二大值到右二，依次类推。
当然你也可以从最左端冒泡
```JavaScript
// min to max
let arr = [] // has some item,item is Number
for (let i = arr.length; i > 1; i--) {
  for (let j = 0; j < i; j++) { // 每次对比移动长度－1，因此上一次遍历已经保证了最大值在最右侧
    if (arr[j] > arr [j + 1]) { // 将当前值右移，保证每次遍历将最大值移到最右侧
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
    }
  }
}

// max to min
let i = arr.length
while (i > 1) {
  let j = 0
  while (j < i) {
    if (arr[j] < arr[j + 1]) {
      [arr[j], arr[j + 1]]] = [arr[j + 1], arr[j]]
    }
  }
}

// right to left min to max
for (let i = arr.length; i > 1; i--) {
  for (let j = arr.length - 1; j > arr.length - i; j--) {
    if (arr[j] > arr[j - 1]) {
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
    }
  }
}
```

> 每遍历一次，下一次遍历长度－1，两层循环，外层控制每次冒泡的长度，内层控制是否交换值（向左或向右冒泡）

#### 选择排序
选择排序和冒泡排序的思路类似，但是每次遍历不是将一个值一直移动（像冒泡一样一直往一个方向移动），而是移动到某个固定位置，如从小到大排序，那么每次遍历将最小值与第一个值交换。另外冒泡排序外层是负责冒泡长度的，而选择排序外层则是控制对比值的索引
```JavaScript
// left to right compare
let arr = []
for (let i = 0; i < arr.length - 1; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[j] < arr[i]) { // compare with min
      [arr[j], arr[i]] = [arr[i], arr[j]]
    }
  }
}
// right to left min to max
let i = arr.length - 1
while (i > 0) {
  let j = i - 1
  while (j > -1) {
    if (arr[j] > arr[i]) {
      [arr[j], arr[i]] = [arr[i], arr[j]]
    }
  }
}
```

> 外层控制最值下标，内层控制是否与最值交换

#### 插入排序
就像我们整理扑克牌一样，前面整理过的一定是从小到大依次排好的，那么后续未整理的扑克牌只需要插入到第一个比它小的值后面就行了
```JavaScript
// normal bubble
let arr = []
for (let i = 1; i < arr.length; i++) {
  let j = i
  while (j > 0 && arr[j] < arr[j - 1]) {
    [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
    j--
  }
}
// select
for (let i = 1; i < arr.length; i++) {
  let j = i
  let cur = arr[i]
  while (j > 0 && arr[j] < arr[j - 1]) {
    arr[j] = arr[j - 1]
    j--
  }
  arr[j] = cur // or if (i !== j) {}
}
// arr splice
for (let i = 1; i < arr.length; i++) {
  let j = i
  while (j > 0 && arr[j] < arr[j - 1]) {
    j--
  }
  if (i !== j) {
    let cur = arr[i]
    arr.splice(i, 1)
    arr.splice(j, 0, cur)
  }
}
// right to left
for (let i = arr.length - 2; i >= 0; i--) {
  let j = i
  let cur = arr[i]
  while (j < arr.length - 1 && arr[j] > arr[j + 1]) {
    arr[j] = arr[j + 1]
    j--
  }
  arr[j] = cur
}
```

> 插入排序每次向一个已经排完的部分去做一个插入操作

#### 总结
冒泡排序的关键是外层控制每次需要冒泡的距离，内层遍历冒泡距离并负责冒泡（与左或右交换值），就像一个气泡从数组某个位置一直交换位置移动到某一端  
选择排序的关键是外层控制选择对比值的下标，内层遍历选择值前或后所有值并负责是否与选择值交换，每次选择对比一个值，直到那个值是需要对比值内最小的  
这两者都是每次外层遍历保证内层会有一部分是完全排序正确的，即遍历起点（冒泡起点，选择对比值）前或后已经是完全排好的，每次计算了剩余任务中的最值。整体遍历次数是固定的。

插入排序的关键是外层控制待插入的值，内层则是将其插入到前方或后方一个合适的位置，就像整理扑克牌一样  
插入起点前只是按顺序排好的，插入值则会在排序好的数组内寻找一个正确的地方插入进去，整体遍历次数还和数组本身有关，遍历次数不是稳定的

### 去重算法

### 检索算法

### 高级排序算法

#### 快速排序
快速排序的核心就是计算一个中心点，然后将中心点从数组中取出，然后遍历新数组将大于中心点的值放在右数组中小于中心点的值放在左数组中然后拼接左右数组进行上述运算的结果，递归退出条件是直到数组长度为一

```JavaScript
function quickSort (arr) {
  if (arr.length <= 1) return arr
  let pivotInd = ~~(arr.length / 2)
  let pivot = arr.splice(pivotInd, 1)[0]
  let left = []
  let right = []
  let l = 1
  for (let i = 0 ; i < arr.length ; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else if (arr[i] > pivot) {
      right.push(arr[i])
    } else {
      l++
    }
  }
  return quickSort(left).concat(new Array(l).fill(pivot), quickSort(right))
}
// 使用一行代码实现快排
function quickSort (arr) {
  return arr.length < 2 ? arr : quickSort(arr.slice(1).filter(item => item <= arr[0])).concat([arr[0]], quickSort(arr.slice(1).filter(item => item > arr[0])))
}
```

#### 堆栈排序

#### 归并排序
个人感觉归并排序不如快速排序容易理解，归并排序是自上向下不断将数组均分直到两个子数组长度均小于2然后自下向上不断合并，因为每个合并过的子数组已经保证了从小到大，因此可以保证合并的新数组也是从小到大

```JavaScript
function merge (left, right) {
  let result = []
  while (left.length > 0 && right.length > 0) {
    if (left[0] > right[0]) {
      result.push(right.shift())
    } else {
      result.push(right.shift())
    }
  }
  if (left.length > 0) {
    result = result.concat(left)
  }
  if (right.length > 0) {
    result = result.concat(right)
  }
  return result
}
function mergeSort (arr) {
  if (arr.length < 2) { // 当数组长度为1或0才会执行merge操作，而merge的开始已经保证了从小至大，所以后面的concat操作没毛病
    return arr
  }
  let mid = ~~(arr.length / 2)
  let left = arr.slice(0, mid)
  let right = arr.slice(mid)
  return merge(mergeSort(left), mergeSort(right)) // 不断均分然后不断merge
}
// 对比快速排序
function quickSort (arr) {
  if (arr.length < 2) {
    return arr
  }
  let pivotInd = ~~(arr.length / 2)
  let pivot = arr.splice(pivotInd, 1)
  let left = [], right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(pivot, quickSort(right))
}
```

#### 希尔排序
希尔排序其实只是对插入排序的一种优化，当数据量足够大的时候插入排序需要不断对比换位，插入。比如一个特别小的值在数组后端，那么需要不断换位插入。如果一开始先将这个数组按照一定间隔分成若干“子数组”，然后对每个子数组进行插入排序，这样可以保证每个子数组已经是从小到大，并可以通过多次这种间隔插入排序操作，那么最后在执行整体的插入排序时就不需要频繁的换位插入操作，那么问题来了，如何确定这个希尔数组呢？有一个常数701, 301, 132, 57, 23, 10, 4, 1，当然还可以计算出来  
```JavaScript
function shellsort (list) {
  let N = list.length
  let h = 1
  while (h < N / 3) {
    h = h * 3 + 1
  }
  while (h >= 1) {
    // one shell ...
    h = (h - 1) / 3
  }
}
```

#### 计数排序
计数排序有点类似数组去重，由于js数组不需要声明长度，因此我们可以将值变为下标存(意味着每个值是自然数)起来，然后统计每个值重复的次数，最后将值填回去

```JavaScript
function countSort (arr) {
  let l = arr.length
  let result = []
  let count = []
  let min = max = arr[0]
  for (let i = 0; i < arr.length; i++) {
    count[arr[i]] = count[arr[i]] ? count[arr[i]] + 1 : 1
    min > arr[i] && (min = arr[i])
    max < arr[i] && (max = arr[i])
  }
  for (let j = min; j <= max; j++) {
    if (count[j]) {
      result = result.concat(new Array(count[j]).fill(count[j]))
    }
  }
  return result
}
```

#### 桶排序
桶排序和计数排序很像，但是桶排序适用场景是值比较固定（可以为负数，浮点数），重复数较多，数据多样性较少。如某个省高考分数排名，那么可以将每个分值作为一个空数组，然后遍历所有得分，将分数压入相应的数组，最后合并所有数组。

#### 排序算法总结
