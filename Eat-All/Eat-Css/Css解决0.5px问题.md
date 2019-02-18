此方法是我在项目中常用的方法：
```
.parent{
   position:relative;
    /*其他样式自己定*/
}
.parent ::after{
  content:''; //注意要加上这个
  position:absolute;
  left:0;
  bottom:0;
  transform:scaleY(.5);
  //transform-origin:50% 100%; 看情况加
}
```
注：如若伪元素没有显示首先检查content是否加上（额，本人之前总是忘记，很尴尬），之所以加在伪元素中是为了防止transform：scaleY(.5)会对整体造成缩小

对伪元素中的left,bottom定为0是因为这里考虑放置框框的底部，并与之对齐，使用者可以自己定义位置

具体不清楚transform-origin什么作用的参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin)