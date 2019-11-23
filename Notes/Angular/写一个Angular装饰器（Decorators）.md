# 写一个Angular装饰器（Decorators）

## 本文将围绕：
   ### 1. what is it? 
   ### 2. why use it?
   ### 3. how to use it?

## 业务需求场景提供（参考）：
  1. 格式化 `@Input` 值 

  2. 动态校验 `@Input` 传入的值类型
  3. ...

## 代码完整示例：
[示例代码](https://stackblitz.com/edit/angular-inputboolean)

## 1. What is it?
先看看TypeScript官方对Decorators 解释:
> 装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

例如Angular中的 `@Input`：
```
  @Input 
  value: string;
```

这样看是不是清晰了点，实际上装饰器的作用是对设计模式中的装饰者模式的实现。

装饰者模式：
> 指在不必 `改变原类文件` 或者 `使用继承` 的情况下，动态扩展对象的功能

**装饰器分为：**

类装饰器： `(target) => {} `

方法装饰器：`(target, methodName: string, descriptor: PropertyDescriptor) => {} ` 

参数装饰器：`(target, methodName: string, paramIndex: number) => {}`

属性装饰器：`(target, propertyName: string) => {}`

## 2. Why use it?
正如前面提供的两个业务场景，我们取第一个使用装饰器解决下该问题。

**思路：** 我们需要控制一个组件loading的状态，那么设isLoading为true或者false,来控制开关。

OK，我们开始写代码：

*Child Comonent：*
```
// html
  <div *ngIf="isLoading">isLoading 为 true</div>
  <div *ngIf="!isLoading">isLoading 为 false</div>

//ts
  @Input() isLoading = false;
```
*Parent Component*
```
  <app-child [isLoading]="'false'"></app-child>
```
*Result*

![格式化前](https://upload-images.jianshu.io/upload_images/12238220-7c891f6b7c7dbade.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


我传了`'false'`但是为什么显示的是true，细心的人可以发现是因为传了一个不规范的字段，正如我写的`'false'`，传的是一个string，进行转译`!!'false'`，我们可以看到它是一个true。

除了误传'false'，还会有开发者传入一个value，有值或无值做一个开关控制。

作为组件的提供者，希望避免这样的传值，我们可以对传入的值进行格式化，可如下操作：

```
 @Input()
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(v) {
    this._isLoading = coerceBooleanProperty(v);
  }
  _isLoading = false;
```
> coerceBooleanProperty：是@angular/cdk/coercion中的一个方法，主要用途将传入的值进行强制转化为boolean.

我们再看一下页面显示：

![利用setter 格式化后](https://upload-images.jianshu.io/upload_images/12238220-ed2bc238aa48157a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以发现这个成功解决我们的问题，但是如果每个地方都要写一个setter 和getter ，并且创建一个新的变量_isLoading，那也太麻烦了，这时候装饰器就派上用场了。

## 3. How to use it?

首先我们先看一下简单的装饰器：
```
//类装饰器
function Man(target: Function):void{
    target.prototype.__isMan = true;
}

//使用类装饰器
@Man
class Person{
    constructor(){}
}

//测试装饰后的结果
let person = new Person();
console.log(person.__isMan);//true

```
这是一个类装饰器，还有其他几种，前面可以看到，具体写法就举例。但是如果我们在写一个项目，还会遇到方法，参数，属性修饰器，所以我们需要统一一下方法。

在这之前我们先看看ts官方给的一个提示：
> 如果我们要定制一个修饰器如何应用到一个声明上，我们得写一个装饰器工厂函数。 装饰器工厂就是一个简单的函数，它返回一个表达式，以供装饰器在运行时调用。

**代码来源于[ng-zorro源码]():**

因此我们需要写一个通用的工厂函数。

*工厂函数拆解：*

一个通用装饰器工厂函数的外壳如下（详细在文章后面）：
```


// 因为我们需要一个通用的装饰器工厂函数，所以我们传入两个参数name和fallback
// name: 装饰器名字(如：InputBoolean)
// fallback：调用需要执行的函数(如：toBoolean)

// 其次因为装饰器分为5种，但是我们主要针对属性和方法装饰器，因此
// originalDescriptor可为空（属性装饰器不包括该值，可看前面装饰器的介绍）

function propDecoratorFactory(name:string,fallback:function){
 
  return propDecorator(
    target: any, 
    propName: string, 
    originalDescriptor?: TypedPropertyDescriptor<any>
  ){
      ... 
  }
}
```

通用装饰器工厂函数完整版（个人的理解在代码注释中）：
```
function propDecoratorFactory<T, D>(name: string, fallback: (v: T) => D): (target: any, propName: string) => void {
  function propDecorator(target: any, propName: string, originalDescriptor?: TypedPropertyDescriptor<any>): any {

    // 创建私有名字
    const privatePropName = `$$__${propName}`;

    // 首先判断是否设置过该值，防止重复操作
    if (Object.prototype.hasOwnProperty.call(target, privatePropName)) {
      console.warn(`The prop "${privatePropName}" is already exist, it will be overrided by ${name} decorator.`);
    }

    // 利用Object.defineProperty创建监听
    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true
    });

    // 触发情况：访问时会触发getter,设值时会触发setter
    // 具体不解释，可以看es6对Object.defineProperty的解释
    // 题外话，可以一同可看proxy，proxy对Object.defineProperty进行了优化。
    return {
      get(): string {
        // get 雷同于Setter解释
        return originalDescriptor && originalDescriptor.get
          ? originalDescriptor.get.bind(this)()
          : this[privatePropName];
      },
      set(value: T): void {
        // 首先判断修饰器下是否存在Setter，setter存在于originalDescriptor中，我们将先进行规定的format
        // 然后将format值传入其中，调用set 方法继续按照开发者的要求执行
        // 所以如下一个使用的执行顺序是:
        // @Input @InputBoolean set value(v){ this._v = v }
        //  1.调用Object.defineProperty对target上的$$__value进行监听，创建setter + getter
        //  2.setter（内） 触发 ,对传入的值进行格式化(即：调用传入的fallback(v))，拿到格式化的值后format_v
        //  3.调用originalDescriptor 中的setter（外：即开发者创建）方法，传入格式化的值format_v进行做后续处理
        // 因此此处只会对传入的值进行格式化，不会做任何操作。
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.bind(this)(fallback(value));
        }
        this[privatePropName] = fallback(value);
      }
    };
  }

  return propDecorator;
}
```


OK，定义完工厂函数之后，我们需要定义装饰器入口(InputBoolean)，和格式化的函数(toBoolean)
```
// 装饰器入口
export function InputBoolean(): any {
  return propDecoratorFactory('InputBoolean', toBoolean);
}

// 格式化boolean函数
export function toBoolean(value: boolean | string): boolean {
  return coerceBooleanProperty(value);
}
```


然后使用：
```
  @Input() @InputBoolean() isLoading = false;
```

可以看到最终结果：

![利用装饰器 格式化后](https://upload-images.jianshu.io/upload_images/12238220-ed2bc238aa48157a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)