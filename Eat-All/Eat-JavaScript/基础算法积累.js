let array = [1, 1, '1', '1'];

function unique(array) {
  //res用来存储结果
  var res = [];
  for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
    //此循环判断是否有重复的存在
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (array[i] === res[j]) {
        break;
      }
    }
    if (j === resLen) {
      res.push(array[i])
    }
  }
  return res;
}
console.log(unique(array)); //[1,'1']

//indexOf

var array1 = [1, 1, '1']

function unique1(array) {
  var res = [];
  for (var i = 0, len = array.length; i < len; i++) {
    var current = array[i];
    if (res.indexOf(current) === -1) {
      res.push(current)
    }
  }
  return res;
}

console.log(unique1(array1))


//排序后去重


var array2 = [1, 1, '1']

function unique(array) {
  var res = [];
  var sortedArr = array.concat().sort();
  var len = sortedArr.length;
  var seen;
  for (var i = 0; i < len; i++) {
    //!i判断是不是第一个元素，后面则判断与前一个是否相等
    if (!i || seen !== sortedArr[i]) {
      res.push(sortedArr[i]);
    }
    seen = sortedArr[i]
  }
  return res;
}
console.log(unique(array2))

//排序
function insertionSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    for (var j = i - 1; i >= 0; j--) {
      var tmp = arr[j];
      var order = tmp - element;
      if (order > 0) {
        arr[j + 1] = tmp;
      } else {
        break;
      }
    }
    arr[j + 1] = element;
  }
  return arr;
}

var arr = [6, 5, 4, 3, 2, 1];
console.log(insertionSort(arr));

//快排
//第一种
function quickSort(arr){
  if(arr.length <= 1) return arr;
  //取数组中间的元素作为基准
  var pivotIndex = Math.floor(arr.length/2);
  var pivot = arr.splice(pivotIndex,1)[0];

  var left = [];
  var right = [];

  for(var i = 0; i<arr.length;i++){
    if(arr[i] < pivot){
      left.push(arr[i]);
    }else{
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat([pivot],quickSort(right))
}

var arr = [6, 5, 4, 3, 2, 1];
console.log(quickSort(arr));

//第二种：快速排序（原地）不需要额外的空间存储left和right
function quickSort(arr) {
  // 交换元素
  function swap(arr, a, b) {
      var temp = arr[a];
      arr[a] = arr[b];
      arr[b] = temp;
  }

  function partition(arr, left, right) {
      var pivot = arr[left];
      var storeIndex = left;

      for (var i = left + 1; i <= right; i++) {
          if (arr[i] < pivot) {
              swap(arr, ++storeIndex, i);
          }
      }

      swap(arr, left, storeIndex);

      return storeIndex;
  }

  function sort(arr, left, right) {
      if (left < right) {
          var storeIndex = partition(arr, left, right);
          sort(arr, left, storeIndex - 1);
          sort(arr, storeIndex + 1, right);
      }
  }

  sort(arr, 0, arr.length - 1);

  return arr;
}

console.log(quickSort([6, 7, 3, 4, 1, 5, 9, 2, 8]))


//二分查找

function binary(arr,find){
  var len = arr.length;
  var lowerBound = 0;
  var upperBound = arr.length - 1;
  var mid = null;

  while(lowerBound <= upperBound){
    mid = (lowerBound + upperBound) >> 1;
    if(arr[mid] > find){
      upperBound = mid - 1;
    }else if(arr[mid] < find){
      lowerBound = mid + 1;
    }else{
      return mid;
    }
  }
  return -1;
}

var arr = [ 1, 2, 3, 4, 5, 6 ];
console.log(binary(arr,0));
