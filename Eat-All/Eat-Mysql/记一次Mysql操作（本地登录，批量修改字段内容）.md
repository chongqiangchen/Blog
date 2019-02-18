> ### 快捷（偷懒）提示：
> 想直接看命令行的直接到最底部找 全部集合

## 1、连接数据库+部分操作
 > 这里有两种方式连接数据库：
  a、直接远程连接Mysql数据库（这次没使用）
  b、服务器登陆后连接本地数据库


因为xshell保存了远程服务器的登录信息，所以就为了方便直接选择了b方案。
OK，废话不多说，开始：
```
  //本地登录Mysql
  mysql -u root -h localhost
  //查询数据库
  show databases;
  //进入某个数据库
  use databasename;
  //列出数据库中的表
  show tables;
  //之后就是select语句啦，不会的自行谷歌、百度~
  select * from 某表;
```
## 2、批量修改字段内容
举一个简单的例子：
![这只是例子!](https://upload-images.jianshu.io/upload_images/12238220-a2a4e901a023d9fb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
咳咳，这是一个错误的图片存储方式（先别在意这些细节！），然而自己为了方便挖的坑得自己填。
我现在想做的是改成：
![这只是例子！](https://upload-images.jianshu.io/upload_images/12238220-e6a941ee0c55f5e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
OK，应该知道这个操作干嘛了，我直接上命令：
```
  update 表名 set cover_photo_url = replace(cover_photo_url,'需要替换的内容','');
```
其实就是一个简单的replace的操作，这个还不会，老样子！查！

## 全部集合
```
  //本地登录Mysql
  mysql -u root -h localhost
  //查询数据库
  show databases;
  //进入某个数据库
  use databasename;
  //列出数据库中的表
  show tables;
  //之后就是select语句啦，不会的自行谷歌、百度~
  select * from 某表;
  //批量修改字段内容
  update 表名 set cover_photo_url = replace(cover_photo_url,'需要替换的内容','');
```