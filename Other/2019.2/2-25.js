//二分查找，非递归

function binary1(arr, find) {
  arr = arr.sort();
  var lowerBound = 0;
  var upperBound = arr.length - 1;
  var mid = null;

  while (lowerBound <= upperBound) {

    mid = parseInt((lowerBound + upperBound) / 2);

    if (arr[mid] > find) {
      upperBound = mid - 1;
    } else if (arr[mid] < find) {
      lowerBound = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
}

//二分查找 递归
function binary2(arr, find) {
  var len = arr.length;
  if(len === 1 && arr[0] !== find){
    return -1;
  }
  var tmp = null;
  var mid = parseInt((arr.length - 1)/2);
  if(arr[mid] > find){
    tmp = arr.slice(0,mid-1);
    return binary2(tmp,find);
  }else if(arr[mid] < find){
    tmp = arr.slice(mid+1);
    return binary2(tmp,find)
  }else{
    return mid;
  }

}

var test = [1, 2, 3, 4, 5, 6];
var a = binary2(test,3)
console.log(a); //位置"1"


//继承 原型链继承

function Parent(){
  this.name ='mark'
}
Parent.prototype.getName = function (){
  return this.name
}
function Child(){

}
Child.prototype = new Parent();

var child1 = new Child();
console.log(child1.getName())


//继承 构造函数

function Parent(){
  this.names = ['kevin','daisy']
}
function Child(){
  Parent.call(this)
}


//继承 前两者组合
function Parent(name){
  this.name = name;
}
Parent.prototype.getName = function () {
  return this.name
}
function Child(name, age){
  Parent.call(this,name);
  this.age = age;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;