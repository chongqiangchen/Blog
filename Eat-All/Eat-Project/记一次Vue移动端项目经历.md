（因产品对新版本需求，时间较赶，这两天抽空对以下问题解决方案补充完整）
> ## 具体汇总：
> 注:主要适配IOS和服务端的一些配置优化，吐槽下IOS的坑太多！！
针对所有：
1、首屏加载过慢的白屏优化
2、图片加载过慢优化
3、vue开启history模式，服务端配置解决
IOS端：
4、IOS端滑动卡帧式体验优化
5、IOS端fixed的应用导致多处按钮页面抖动解决
6、IOS端穿透问题（暂未解决）优化
7、IOS10+以上head中加入限制仍然可以缩放问题解决
8、IOS端突然性的不可滑动问题解决（IOS原生开发人员配合）
9、IOS端部分情况下上拉会拉出一块白色区块，整体展示区块变小解决（IOS原生开发人员配合）
10、IOS端键盘弹起导致布局整体上移问题解决
> ## 开发环境
> vue脚手架版本：vue-cli 3.x
vue版本：3.1.3
编译器：VScode
> ## 服务器
> Nginx代理

### 1、首屏加载过慢的白屏优化

**1）开启Nginx中的Gzip**
在nginx.conf文件中
```
http{
  //......其它配置
  gzip on;
  gzip_min_length 1k;
  gzip_buffers 4 16k;
  #gzip_http_version 1.0;
  gzip_comp_level 2;
  gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpg image/jpeg image/gif image/png;
  gzip_vary off;
  gzip_disable "MSIE [1-6]\.";
  //......其它配置
}
```
注意：
a、首先要知道他是对资源的压缩（js,css,jpg...）
b、注意的是gzip_types，这里配置进入你所需要文件压缩传递数据类型
c、测试成功与否方式：
```
$ curl -I -H "Accept-Encoding: gzip, deflate" "http://localhost:8080/antd.dll.js"
//注意是自己的公网IP或者域名+对应的资源文件名
```
**2）使用CDN的方式：**
a、部分使用CDN，减少压缩包体积：
如果因为资源有限，那么就使用一些较为正式的官方CDN（vue,vuex,vue-router,axios）
搜索方式：https://www.bootcdn.cn/
具体配置（vue-cli3.x）：
index.html头部引入，注意顺序。
vue.config.js配置：
```
module.exports = {
    //...其它配置
    configureWebpack: config => {
         config.externals = {
             'vue': 'Vue',
             'vue-router': 'VueRouter',
             'vuex': 'Vuex',
             'axios': 'axios',
              //...
         }
    }
};
```
b、全部采用CDN，需要对象OSS服务器（此处是后台人员帮我申请，具体操作就不说了，可自行百度谷歌）
OK，我所做的事情是：
在vue.config.js中配置：
```
module.exports = {
    baseUrl: '',//填入CDN的网址，打包后JS,CSS资源引入前缀会自动加上
};
```
然后将Index.html丢到服务器上

### 2、图片加载过慢优化
**1）图片大小控制和优化**
因为做的是一个需求多图展现并让用户自定义上传图片的APP，所以为了更好的控制和限制，我们准备引入了截图+压缩的功能。
截图：引用了现有的插件vue-cropper（这块后来非我处理，时间较赶就没去看看使用方式，只不过较为简单，可以参考作者的[npm文档](https://www.npmjs.com/package/vue-cropper)调用）
压缩：采用较为简单的压缩方式，有点瑕疵在优化，就不提供这边瑕疵的方式了（我们可能把压缩的工作交给后台）

**2）利用CDN方式处理图片获取**
（和上面的静态资源上传雷同）
**3）视觉优化：**
 a、首先给予图片一个外壳，不要让图片未加载的时候导致页面变形，造成重排问题
 b、对未加载的成功的图片附上加载失败的图片，因为我们大部分采用了background-image的方式展现图片所以使用了vue的自定义指定方式
```
Vue.directive('checkimg', {
    bind(el, binding) {
        var imgUrl = el.style.backgroundImage.match(/https\S+\.(png|jpg|jpeg|svg)/g)[0];
        var img = new Image();
        img.src = imgUrl;
        img.onload = function () {
        }
        img.onerror = function () {
            el.style.backgroundImage = "url('')" //写入加载失败使用的图片
          }
        }
})
```
直接在引入的地方写入v-checkimg就行
**4）懒加载处理**
（此处暂未加入，准备加入中，后续补充）也可以使用现有的插件 vue-lazy啥来着的我一下子记不清了

### 3、vue开启history模式，服务端配置解决
  此处新开一篇文章做[详细操作教程](https://www.jianshu.com/p/4a6e943368d9)
### 4、IOS端滑动卡帧式体验优化（非通用，个人问题）
**问题现象：**
  滑动时候会出现卡帧一样的滑动感觉，体验贼差
**解决方式：**
  此处导致该问题出现会有很多，在我所优化的项目中是因为在一个.vue页面中为了让body可以滑动，写该页面的同伴在mounted中改变了Body的style的样式但是未在页面destroyed（销毁）时候将其改回来，导致了所有.vue页面都存在了该样式。

  具体原因也很好理解，主要是因为SPA的模式下就一个index页面，你改动了.vue页面，其实就是对整个index页面造成了改动，又不将其销毁改回来，那么整个样式就将会一直存在。
  **注意：**  
 此处不算IOS的坑，而是VUE中会遇到的坑
### 5、IOS端fixed的应用导致多处按钮页面抖动解决
**问题现象：**
fixed的应用导致多处按钮页面抖动解决

**解决方式：**
 说实话fixed在IOS中真的是太坑了，最好就是别用。
如果确实需要，那么简单的解决方式将是对整个页面固定定位（fixed），再将你要悬浮的按钮等等东西使用绝对定位（absolute）确定位置，这样将可以实现你需要的效果
```
<div style="position:fixed">
  <button style="position:absolute"></button>
</div>
```
**注意：**
两者是父子关系，至于整体布局将怎么做是你额外需要考虑的事情。
#### 划重点！划重点！
另外还得注意的是你将通过**router-view**展现的整个.vue页面设置**fixed**也有可能会遇到 **因为IOS穿透问题导致** 放置**router-view**的页面移动并且造成你展现的这个页面发生抖动，我的**解决方式**不是将根源的穿透问题解决，而是一样使用了**绝对定位**，但是最外层（放置**router-view**的页面，此页面不会出现该问题）设置**固定定位**
### 6、IOS端穿透问题优化（暂未解决）
**问题现象：**
因为穿透问题，你跳转子页面的时候会导致后面的页面出现滑动现象。

**解决方式：**
上面也有提到，暂时未能解决该问题，查询了较多的方式也无法解决，只能先做简单的优化在跳转时候把滑动到的位置保留，回来时候再次回到该位置

**注意：**
如果可以的话，希望成功处理该问题的大佬们帮助下！谢谢！
### 7、IOS10+以上head中加入限制仍然可以缩放问题解决
**问题现象：**
遇到的主要问题就是双指触碰会放大缩小

**解决方式：**
这个是IOS为了让safari体验更好造成的原因，
```
document.body.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, false);
```
双击屏幕放大其实一般不会，只要在头部正常设置meta中的viewport
```
<meta name="viewport" content="width=device-width,initial-scale=1.0" minimum-scale="1.0" ,maximum-scale="1.0" ,user-scalable="no">
```

### 8、IOS端突然性的不可滑动问题解决（IOS原生开发人员配合）
**问题现象：**
这个问题主要是在滑动时候突然不滑动，造成的原因我个人认为是IOS中safari什么橡皮筋模式造成
通过调试发现，在滑动时候突然性不能滑动是因为我们这个时候选中了整个Body造成了整个body的被移动，说的更大点我觉得是我们整个html被拖动了，而没有触发或进入我们本身Body中的事件中

**解决方式：**
是App开发人员那边对safari橡皮筋模式进行了限制，取消该效果

**注意：**
（原生代码处理方式不提供，可自行百度谷歌，咳咳，因为我也不知道）
### 9、IOS端部分情况下上拉会拉出一块白色区块，整体展示区块变小解决（IOS原生开发人员配合）
**问题现象：**
有时候我们在滑动的时候会导致整个区块上移，下面出现白色块

**解决方式：**
其实是因为IOS给我展现页面的时候隐藏底部的导航条后并未正确处理造成，如果遇到该问题和IOS开发人员提一下就知道了。唯一注意的是苹果max机型最下面消除的操作方式有点额外的代码，我们IOS开发人员之前也没注意到，测试时候才发现。
**注意：**
（原生代码处理方式不提供，可自行百度谷歌，咳咳，因为我也不知道）

### 10、IOS端键盘弹起导致布局整体上移问题解决
**问题现象：**
当你点击输入框弹出键盘的时候会造成整个布局上移，整个和第九个上移不同，它不会让布局错乱，但是就是整个Body上移，你的所有事件全部要向上移动一部分距离，简单的说就是你看到那个按钮在那里可就是点不了（和抓鱼一样。。。）

**解决方式：**
造成该问题的原因是因为键盘的出现导致了整个scrollY上移了一整个键盘大小的位置，我们只需要在键盘收起的时候置回0.
```
windows.scroll(0,0);
```

**注意：**
可能遇见的是不知道怎么判断键盘收起，我暂时没有一个较为准确的判断，但是我对整个页面点击时候触发一次，输入框change时候触发一次
如果有较好的方式希望提出！谢谢！