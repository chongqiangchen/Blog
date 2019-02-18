> 直接开始，代码详情不细说，以从VUE组件=>插件=>提交到npm为主

## 1、安装工具
按照[Vue-cli官方](https://cli.vuejs.org/zh/guide/prototyping.html)给的步骤安装主要用到的东西。
```
  npm install -g @vue/cli-service-global
```
OK，安装好后简单介绍下如何使用，详细自行去官方查看文档
  #### a、vue serve
> 简单的说就是让你不用为了写一个vue页面要引入什么cdn啊，搭建一个脚手架啊才能够执行，而是你创建一个demo.vue，那么你执行下命令，就跑起来了。

   一种：vue serve main.js、index.js、App.vue 或 app.vue
   另外：vue serve *.vue（随便啥vue文件都行）
#### b、vue build
> 这个就是我们所需要的，将VUE组件=>插件的重要东东，先放命令，后面会用到

```
vue build --target wc(或)lib --name my-demo *.vue (要打包的那个组件名)
```
## 2、创建一个App.vue(为了方便，自己随意取名字)
>没啥可说，写好你的内容，记得，以一个组件思维去写。

可能遇到的坑：
#### a、引入外部的东东
正常引入就是了，老样子，npm install引入，打包的时候会关联起来的
#### b、额，暂时想不起来
.....

## 3、开始打包
```
vue build --target wc(或)lib --name my-demo *.vue (要打包的那个组件名)
```
#### wc是Web Components 组件
#### lib是库

## 4、提交到npm
a、在打包后的dist文件中，npm init，主要对这两个操作，其他回车都行
```
{
  "name": "npm-test111",  //确定没人占用这个名字
  "version": "0.0.1"
}
```
b、创建npm 账号，[官网](https://www.npmjs.com/)创建！
c、发布
```
//登录,输入用户名，密码，邮箱
npm login
//登录成功后，对于文件dist下
npm publish
```
附上npm上传[他人教程](https://www.cnblogs.com/sizhou/p/7992742.html)