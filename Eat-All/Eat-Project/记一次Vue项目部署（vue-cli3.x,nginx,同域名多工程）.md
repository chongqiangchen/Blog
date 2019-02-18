> 提要：vue-router 有两种模式，
1、默认是hash模式，通过URL的hash来模拟URL。
2、另一种history模式，它是利用history.pushStateAPI来模拟URL。
只不过这次我选择history最主要的原因是：hash模式分享链接后有挺多坑。

## 1、再BB下
首先我们先提一下官方给予我们在History模式下服务器部署的帮助
```
location / {
  try_files $uri $uri/ /index.html;
}
```
简单采用[他人](http://www.jianshu.com)的解释：
> $uri就是访问的url，不包含域名和querystring，例如/test/hello 当访问$uri时，如果存在，则访问$uri/, 不存在就访问/index.html 这样配置好，访问http://example.com/时就可以访问到网站了，进入多级目录后刷新页面也不会存在问题。

## 2、修改VUE配置文件（正式开始）
因为我们同一个域名下有多个工程项目，所以我们是采用非根目录下访问的情况，所以我们需要修改VUE配置文件。

vue-cli3.X :
      1、在vue.config.js的文件中加入（此处为了打包后的JS,CSS等文件的路径引向）
```
module.exports = {
  baseUrl:'/tool/'  //根据www.xxx.com/后面的路径写入（比如www.xxx.com/tool）
}
```
官方给出的解释是：
![image.png](https://upload-images.jianshu.io/upload_images/12238220-c2cbe81850ce9286.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    2、改变vue项目中的路由配置，
 ```
const router = new Router({
  mode: "history",
  base:'/tool/',
  //....其他无影响省略
```
  3、OK，VUE需要解决的事情搞定（改变webpack output.publicPath,改变路由base）
## 3、nginx配置
>此处不教程nginx安装之类，只记录和此次项目有关的简单部署配置，如果需要从0开始可以查看我[另外一篇记录](https://www.jianshu.com/p/48a051de5e60)
咳咳：性子急的可以直接看最下面配置

  1、老样子一步一步来，我们需要根据官方提供的简单修正下代码
```
location / {
  try_files $uri $uri/ /index.html;
}
```
改为：(注意下，我现在都是以/tool来记录)
```
  location /tool { 
        try_files $uri $uri/ /tool/index.html;
   }
```
2、我们先看一下同域下多工程项目的结构：
```
server {
    listen   80;        #端口  
    server_name  xxxx.com;
    root /var/html;
    location /{
      ... #xxxx.com
    }
    location /tool { 
      ... #对应的访问地址 xxxx.com/tool
    }
    location /community { 
      ... #  xxxx.com/community
    }
}
```
OK,这样的结构穿插我们的东东
```
server {
    listen   80;        #端口  
    server_name  xxxx.com;
    root /var/html;
    location /{
    }
    location /tool { 
      index index.html;
      try_files $uri $uri/ /tool/index.html;
    }
    location /community { 
      index index.html;
      try_files $uri $uri/ /community/index.html;
    }
}
```
> 题外话：
网上还有alias的路径指向，root和alias的区别在于（个人理解，出错希望点出）：
location /file/{
    alias /var/html/file; #这个查找文件的路径直接是/var/html/file
}
location /file/{
    root /var/html/file; #这个查找文件的路径应该是/var/html/file/file
    #所以应该为 root /var/html;因此之后的配置我将其放置在全局中
}

3、这一步其实看情况选择，一般是不会有啥问题，但有些会遇见JS,CSS等文件引入出错，解决办法是
```
    location  ~ .*\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt)$
    {
      root /var/html;
      proxy_temp_path /var/html;
    }
```
4、好的，最终的配置文件是：
```
server {
    listen   80;        #端口  
    server_name  xxxx.com;
    root /var/html;
    location /{
    }
    location /tool { 
      index index.html;
      try_files $uri $uri/ /tool/index.html;
    }
    location /community {  
      index index.html;
      try_files $uri $uri/ /community/index.html;
    }
    location  ~ .*\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt)$
    {
      root /var/html;
      proxy_temp_path /var/html;
    }
}
```
好的，将其保存上传，并将打包好的文件直接丢入对应的tool或者community，然后访问xxxx.com/tool或者/community
## 4、最后就是nginx修改配置一定要重启！！
```
nginx -t
nginx -s reload
//如果这个代码不行可以自行谷歌百度下命令行
```
