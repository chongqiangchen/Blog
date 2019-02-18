> 就不多说其他，作为一名前端总是要多学点东西，此次记录着自己将html+js上传至服务器，利用Nginx部署的步骤。(如果有任何错误点希望大家提出，并且如果有不懂的可以私信我一起探讨！)
注：如果对vue项目history模式部署有问题的可以查看另一篇 ： [Vue项目nginx部署](https://www.jianshu.com/p/4a6e943368d9)
## 准备：
 1、一个云服务器，我用了[腾讯的学习机](https://cloud.tencent.com/act/campus)（原因嘛：便宜呗，选择了Ubuntu系统，购买时同时选择一个域名，后续会需要，但是如果不进行域名绑定就算啦）
2、下载一个WinSCP（用来上传文件至服务器,下载比较简单我就不找下载地址啦）
3、(可选)Xshell

## 1.本地连接到你的服务器
OK，在这一步开始之前请确定有一个自己的服务器，接下来我全部以腾讯云ubuntu为例子（其实差不多的）
![image.png](https://upload-images.jianshu.io/upload_images/12238220-42e8debcb4c1e125.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这是我买好后进入控制台查看你的外（公）网IP（红标，外网或公网）
### mac:  
    ssh root@你的服务器外网IP

本人使用win10系统进行部署，所以mac就简单带过。
### win10:
其实WIN10的连接方法也挺多的
1、你可以用win10自带的powershell或者安装过git的人都知道git bash，这两个都可以使用ssh root@外网IP连接，不需要下载Xshell
2、只不过为了方便win10下我还是选择Xshell 毕竟是可记录的。
![image.png](https://upload-images.jianshu.io/upload_images/12238220-7e7a2700a60a53cc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
输入对应的IP地址取一个名称，连接输入用户root和对应的密码

> 有人可能不知道自己的密码，额，我也不知道，所以我重置了自己的密码

![重置密码](https://upload-images.jianshu.io/upload_images/12238220-26bfcf89432a9a17.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![登录成功](https://upload-images.jianshu.io/upload_images/12238220-a63ac7bd52d6ad89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 2、服务器上安装nginx 
```
# CentOS
yum install nginx
# Ubuntu
sudo apt-get upgrade
sudo apt-get install nginx
# Mac
brew install nginx
```
OK，我的服务器是ubuntu所以选择第二种，安装完后在浏览器输入对应的外网IP看到这个你就成功了一步。
![image.png](https://upload-images.jianshu.io/upload_images/12238220-2fa91fb4f8a05889.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 3、正式部署
1、在根目录中创建 www/static-web两个文件夹
```
sudo mkdir /www
cd /www
sudo mkdir static-web
```
2、利用WinScp上传文件(当然还有其他方式比如将文件存到Github用git clone下载进入static-web文件夹中等等，这边不进行讲解)
下载来后点击新建会话：
![新建会话](https://upload-images.jianshu.io/upload_images/12238220-53b56e30a4158f39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/12238220-39024114e2cf4b4c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
>这里注意的是用户名根据自己的服务器而定,包括上面的root如果不行可以换成对应的用户名试试

![成功建立后](https://upload-images.jianshu.io/upload_images/12238220-f91da858bcb1fffd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以看到www文件就是我们所创建的

之后就是对应从左边拖进右边![image.png](https://upload-images.jianshu.io/upload_images/12238220-32ecb33ab0652fb7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
（默认入口是index.html）
3、简单配置Nginx
```
cd /etc/nginx/conf.d/
```
第一次操作的话内部是空的，所以我们需要创建sudo vi nginx.conf
之后就是使用vim编辑
当然你可以使用winScp进行编辑保存，更为方便
内容如下
```
server {
 	server_name 你的外网IP;
 	root /www/static-web/;
 	index index.html;
 	location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
 	   root /www/static-web/;
 	}
}

```
到这步大致其实完成了，然后使用sudo nginx -t测试下是否成功，可以的话就重启sudo nginx -s reload，然后在浏览器中输入外网ip就可以访问啦。

>之后你的步骤你可以不看，都是与域名绑定IP和将http变为https的讲解

## 4、域名绑定IP
1、注册一个实名认证的域名![已实名认证，未备案（不影响）](https://upload-images.jianshu.io/upload_images/12238220-e77ca3cb5dc9798a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2、然后点击图中红标处的解析
![image.png](https://upload-images.jianshu.io/upload_images/12238220-12c403d18f33242e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
红标处为你的公网IP，然后保存就好了后，记住
把nginx.conf中server_name换成你的www.域名
然后重启sudo nginx -s reload这样就好啦，你可以通过http://www.你的域名 访问了

## 5、将HTTP改为HTTPS
老位置找SSL证书管理
![image.png](https://upload-images.jianshu.io/upload_images/12238220-ac7f2520bf30f5d7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![购买证书](https://upload-images.jianshu.io/upload_images/12238220-27557c292abee82d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

记得买免费的就行

![管理界面点击下载获取对应的代码段](https://upload-images.jianshu.io/upload_images/12238220-eb6441d11c73d216.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 1、Nginx文件夹内获得SSL证书文件 1_www.domain.com_bundle.crt 和私钥文件 2_www.domain.com.key
2、将域名 www.domain.com 的证书文件1_www.domain.com_bundle.crt 、私钥文件2_www.domain.com.key保存到同一个目录，例如/usr/local/nginx/conf目录下。

更新nginx.conf的内容：
```
server {
	listen 443;
 	server_name 自己的域名;
 	root /www/static-web/;
 	index index.html;
	ssl on;
	ssl_certificate conf.d/1_根据文件的名字_bundle.crt;
        ssl_certificate_key conf.d/2_根据文件的名字.key;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #按照这个协议配置
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;#按照这个套件配置
        ssl_prefer_server_ciphers on;
 	location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
 	   root /www/static-web/;
 	}
}

```
OK，到这边保存后使用sudo nginx -t测试是否成功。通过后重启nginx就可以通过https://www.你的域名 访问