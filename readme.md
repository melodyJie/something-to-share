# JavaScript部分常用模式简介

## 设计模式目的

设计模式是为了更好的代码重用性，可读性，可靠性，可维护性。

## 设计六大原则

1. 单一职责原则

    * 概念：对功能进行分类，代码进行解耦
    * 栗子：一个网络请求框架大致分为：请求类，缓存类，配置类；不能把这三个功能混合在一起，必须分成三个类分别去实现不同的功能

2. 里氏替换原则

    * 概念：在继承类时，除了扩展一些新的功能之外，尽量不要删除或者修改对父类方法的引用，也尽量不要重载父类的方法
    * 栗子：每个类都是Object的子类，Object类中有一个toString()的方法，假如子类重写该方法并且返回null，这个子类的下一级继承返回的都是null，那么在不同开发人员维护时可能考虑不到这个问题，并且很可能会导致程序崩溃

3. 依赖倒转原则

    * 概念：高层模块不依赖低层次模块的细节，高层次就是不依赖细节而是依赖抽象（不依赖具体的类，而是依赖于接口）
    * 栗子：某个网络框架为了满足不同开发者的需求，即能使用高效的OkHttp框架，也可以使用原生的API。正所谓萝卜白菜各有所爱，那么是如何进行切换的呢，这个时候需要面向接口编程思想了，把一些网络请求的方法封装成一个接口，然后分别创建OkHttp和原生API的接口实现类，当然也方便后续其他开发人员进行扩展其他网络框架的应用

4. 接口隔离原则

    * 概念：在定义接口方法时应该合理化，尽量追求简单最小，避免接口臃肿
    * 栗子：在实际开发中，往往为了节省时间，可能会将多个功能的方法抽成一个接口，其实这设计理念不正确的，这样会使接口处于臃肿的状态，这时就需要合理的拆分接口中的方法，另外抽取成一个独立的接口，避免原有的接口臃肿导致代码理解困难

5. 最少知识原则(迪米特法则)

    * 概念：一个对象应该对其他对象有最少的了解；一个类应该对自己需要耦合或调用的类知道得最少，类的内部如何实现、如何复杂都与调用者或者依赖者没关系，调用者或者依赖者只需要知道他需要的方法即可，其他的一概不关心。类与类之间的关系越密切，耦合度越大，当一个类发生改变时，对另一个类的影响也越大。只与直接的朋友通信。每个对象都必然会与其他对象有耦合关系，两个对象之间的耦合就成为朋友关系，这种关系的类型有很多，例如组合、聚合、依赖等。
    * 栗子：一般在使用框架的时候，框架的开发者会抽出一个类供外部调用，而这个主要的类像是一个中介一样去调用框架里面的其他类，恰恰框架里面其他类一般都是不可访问（调用）的，这个框架就遵守了迪米特原则，其他开发人员只关心调用的方法，并不需要关心功能具体如何实现

6. 开放封闭原则

    * 概念：类、模块和函数应该对扩展开放，对修改关闭
    * 栗子：在软件的生命周期内，因为变化、升级和维护等原因需要对软件原有代码进行修改时，可能会给旧代码中引入错误，也可能会使我们不得不对整个功能进行重构，并且需要原有代码经过重新测试，整个流程对开发周期影响很大，这个时候就需要开闭原则来解决这种问题

## 设计模式分类

总体来说设计模式分为三大类：

- 创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。
- 结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。
- 行为型模式，共十一种：策略模式、模板方法模式、观察者模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。
其实还有两类：并发型模式和线程池模式。

不过，对于前端来说，有的设计模式在平时工作中几乎用不到或者很少用到，来来来，来了解下前端常见的设计模式

### 一、模块模式

> 模块模式的思路是为单体模式添加私有变量和私有方法能够减少全局变量的使用。如下就是一个模块模式的代码结构：

```
var singleMode = (function(){
    // 创建私有变量
    var privateNum = 112;
    // 创建私有函数
    function privateFunc(){
        // 实现自己的业务逻辑代码
    }
    // 返回一个对象包含公有方法和属性
    return {
        publicMethod1: publicMethod1,
        publicMethod2: publicMethod1
    };
})();
```

模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，先定义了私有变量和函数，供内部函数使用，然后将一个对象字面量作为函数的值返回，返回的对象字面量中只包含可以公开的属性和方法。这样的话，可以提供外部使用该方法；由于该返回对象中的公有方法是在匿名函数内部定义的，因此它可以访问内部的私有变量和函数。

#### 我们什么时候使用模块模式？

> 如果我们必须创建一个对象并以某些数据进行初始化，同时还要公开一些能够访问这些私有数据的方法，那么我们这个时候就可以使用模块模式了。

#### 理解增强的模块模式

> 增强的模块模式的使用场合是：适合那些单列必须是某种类型的实例，同时还必须添加某些属性或方法对其加以增强的情况。比如如下代码：

```
function CustomType() {
  this.name = "tugenhua";
};
CustomType.prototype.getName = function(){
  return this.name;
}
const ModuleA = function(){
  // 定义私有
  var privateA = "aa";
  // 定义私有函数
  function A(){};

  // 实例化一个对象后，返回该实例，然后为该实例增加一些公有属性和方法
  var object = new CustomType();

  // 添加公有属性
  object.A = "aa";
  // 添加公有方法
  object.B = function(){
      return privateA;
  }
  // 返回该对象
  return object;
};
```

### 二、代理模式

> 代理是一个对象，它可以用来控制对本体对象的访问，它与本体对象实现了同样的接口，代理对象会把所有的调用方法传递给本体对象的；代理模式最基本的形式是对访问进行控制，而本体对象则负责执行所分派的那个对象的函数或者类，简单的来讲本地对象注重的去执行页面上的代码，代理则控制本地对象何时被实例化，何时被使用；我们在上面的单体模式中使用过一些代理模式，就是使用代理模式实现单体模式的实例化，其他的事情就交给本体对象去处理；

> 应用场景：ES6 Proxy、Vuex中对于getters访问、图片预加载等

#### 代理的优点：

1. 代理对象可以代替本体被实例化，并使其可以被远程访问；
2. 它还可以把本体实例化推迟到真正需要的时候；对于实例化比较费时的本体对象，或者因为尺寸比较大以至于不用时不适于保存在内存中的本体，我们可以推迟实例化该对象；

我们先来理解代理对象代替本体对象被实例化的列子；比如现在京东ceo想送给奶茶妹一个礼物，但是呢假如该ceo不好意思送，或者由于工作忙没有时间送，那么这个时候他就想委托他的经纪人去做这件事，于是我们可以使用代理模式来编写如下代码：

```
// 先申明一个奶茶妹对象
var TeaAndMilkGirl = function(name) {
    this.name = name;
};
// 这是京东ceo先生
var Ceo = function(girl) {
    this.girl = girl;
    // 送结婚礼物 给奶茶妹
    this.sendMarriageRing = function(ring) {
        console.log("Hi " + this.girl.name + ", ceo送你一个礼物：" + ring);
    }
};
// 京东ceo的经纪人是代理，来代替送
var ProxyObj = function(girl){
    this.girl = girl;
    // 经纪人代理送礼物给奶茶妹
    this.sendGift = function(gift) {
        // 代理模式负责本体对象实例化
        (new Ceo(this.girl)).sendMarriageRing(gift);
    }
};
// 初始化
var proxy = new ProxyObj(new TeaAndMilkGirl("奶茶妹"));
proxy.sendGift("结婚戒"); // Hi 奶茶妹, ceo送你一个礼物：结婚戒
```

代码如上的基本结构，TeaAndMilkGirl 是一个被送的对象(这里是奶茶妹)；Ceo 是送礼物的对象，他保存了奶茶妹这个属性，及有一个自己的特权方法sendMarriageRing 就是送礼物给奶茶妹这么一个方法；然后呢他是想通过他的经纪人去把这件事完成，于是需要创建一个经济人的代理模式，名字叫ProxyObj ；他的主要做的事情是，把ceo交给他的礼物送给ceo的情人，因此该对象同样需要保存ceo情人的对象作为自己的属性，同时也需要一个特权方法sendGift ，该方法是送礼物，因此在该方法内可以实例化本体对象，这里的本体对象是ceo送花这件事情，因此需要实例化该本体对象后及调用本体对象的方法(sendMarriageRing).

最后我们初始化是需要代理对象ProxyObj；调用ProxyObj 对象的送花这个方法(sendGift)即可；

对于我们提到的优点，第二点的话，我们下面可以来理解下虚拟代理，虚拟代理用于控制对那种创建开销很大的本体访问，它会把本体的实例化推迟到有方法被调用的时候；比如说现在有一个对象的实例化很慢的话，不能在网页加载的时候立即完成，我们可以为其创建一个虚拟代理，让他把该对象的实例推迟到需要的时候。

#### 理解使用虚拟代理实现图片的预加载

在网页开发中，图片的预加载是一种比较常用的技术，如果直接给img标签节点设置src属性的话，如果图片比较大的话，或者网速相对比较慢的话，那么在图片未加载完之前，图片会有一段时间是空白的场景，这样对于用户体验来讲并不好，那么这个时候我们可以在图片未加载完之前我们可以使用一个 loading加载图片来作为一个占位符，来提示用户该图片正在加载，等图片加载完后我们可以对该图片直接进行赋值即可；下面我们先不用代理模式来实现图片的预加载的情况下代码如下：

#### 第一种方案：不使用代理的预加载图片函数如下

```
// 不使用代理的预加载图片函数如下
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    var img = new Image();
    img.onload = function(){
        imgNode.src = this.src;
    };
    return {
        setSrc: function(src) {
            imgNode.src = "http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif";
            img.src = src;
        }
    }
})();
// 调用方式
myImage.setSrc("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png");
```

#### 第二种方案：使用代理模式来编写预加载图片的代码如下：

```
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();
// 代理模式
var ProxyImage = (function(){
    var img = new Image();
    img.onload = function(){
        myImage.setSrc(this.src);
    };
    return {
        setSrc: function(src) {
                         myImage.setSrc("http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif");
        img.src = src;
        }
    }
})();
// 调用方式
ProxyImage.setSrc("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png");
```

第一种方案是使用一般的编码方式实现图片的预加载技术，首先创建imgNode元素，然后调用myImage.setSrc该方法的时候，先给图片一个预加载图片，当图片加载完的时候，再给img元素赋值，第二种方案是使用代理模式来实现的，myImage 函数只负责创建img元素，代理函数ProxyImage 负责给图片设置loading图片，当图片真正加载完后的话，调用myImage中的myImage.setSrc方法设置图片的路径；他们之间的优缺点如下：

1. 第一种方案一般的方法代码的耦合性太高，一个函数内负责做了几件事情，比如创建img元素，和实现给未加载图片完成之前设置loading加载状态等多项事情，未满足面向对象设计原则中单一职责原则；并且当某个时候不需要代理的时候，需要从myImage 函数内把代码删掉，这样代码耦合性太高。
2. 第二种方案使用代理模式，其中myImage 函数只负责做一件事，创建img元素加入到页面中，其中的加载loading图片交给代理函数ProxyImage 去做，当图片加载成功后，代理函数ProxyImage 会通知及执行myImage 函数的方法，同时当以后不需要代理对象的话，我们直接可以调用本体对象的方法即可；

从上面代理模式我们可以看到，代理模式和本体对象中有相同的方法setSrc,这样设置的话有如下2个优点：

1. 用户可以放心地请求代理，他们只关心是否能得到想要的结果。假如我门不需要代理对象的话，直接可以换成本体对象调用该方法即可。
2. 在任何使用本体对象的地方都可以替换成使用代理。

当然如果代理对象和本体对象都返回一个匿名函数的话，那么也可以认为他们也具有一直的接口；比如如下代码：

```
var myImage = (function(){
    var imgNode = document.createElement("img");
    document.body.appendChild(imgNode);
    return function(src){
        imgNode.src = src; 
    }
})();
// 代理模式
var ProxyImage = (function(){
    var img = new Image();
    img.onload = function(){
        myImage(this.src);
    };
    return function(src) {
                myImage("http://img.lanrentuku.com/img/allimg/1212/5-121204193Q9-50.gif");
        img.src = src;
    }
})();
// 调用方式
ProxyImage("https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png");
```

#### 理解缓存代理：

> 缓存代理的含义就是对第一次运行时候进行缓存，当再一次运行相同的时候，直接从缓存里面取，这样做的好处是避免重复一次运算功能，如果运算非常复杂的话，对性能很耗费，那么使用缓存对象可以提高性能;我们可以先来理解一个简单的缓存列子，就是网上常见的加法和乘法的运算。代码如下：

```
// 计算乘法
var mult = function(){
    var a = 1;
    for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
        a = a*arguments[i];
    }
    return a;
};
// 计算加法
var plus = function(){
    var a = 0;
    for(var i = 0,ilen = arguments.length; i < ilen; i+=1) {
        a += arguments[i];
    }
    return a;
}
// 代理函数
var proxyFunc = function(fn) {
    var cache = {};  // 缓存对象
    return function(){
        var args = Array.prototype.join.call(arguments,',');
        if(args in cache) {
            return cache[args];   // 使用缓存代理
        }
        return cache[args] = fn.apply(this,arguments);
    }
};
var proxyMult = proxyFunc(mult);
console.log(proxyMult(1,2,3,4)); // 24
console.log(proxyMult(1,2,3,4)); // 缓存取 24

var proxyPlus = proxyFunc(plus);
console.log(proxyPlus(1,2,3,4));  // 10
console.log(proxyPlus(1,2,3,4));  // 缓存取 10
```

### 职责链模式

> 优点是：消除请求的发送者与接收者之间的耦合。

职责连是由多个不同的对象组成的，发送者是发送请求的对象，而接收者则是链中那些接收这种请求并且对其进行处理或传递的对象。请求本身有时候也可以是一个对象，它封装了和操作有关的所有数据，基本实现流程如下：

1. 发送者知道链中的第一个接收者，它向这个接收者发送该请求。
2. 每一个接收者都对请求进行分析，然后要么处理它，要么它往下传递。
3. 每一个接收者知道其他的对象只有一个，即它在链中的下家(successor)。
4. 如果没有任何接收者处理请求，那么请求会从链中离开。

我们可以理解职责链模式是处理请求组成的一条链，请求在这些对象之间依次传递，直到遇到一个可以处理它的对象，我们把这些对象称为链中的节点。比如对象A给对象B发请求，如果B对象不处理，它就会把请求交给C，如果C对象不处理的话，它就会把请求交给D，依次类推，直到有一个对象能处理该请求为止，当然没有任何对象处理该请求的话，那么请求就会从链中离开。

比如常见的一些外包公司接到一个项目，那么接到项目有可能是公司的负责项目的人或者经理级别的人，经理接到项目后自己不开发，直接把它交到项目经理来开发，项目经理自己肯定不乐意自己动手开发哦，它就把项目交给下面的码农来做，所以码农来处理它，如果码农也不处理的话，那么这个项目可能会直接挂掉了，但是最后完成后，外包公司它并不知道这些项目中的那一部分具体有哪些人开发的，它并不知道，也并不关心的，它关心的是这个项目已交给外包公司已经开发完成了且没有任何bug就可以了；所以职责链模式的优点就在这里：

  * 消除请求的发送者(需要外包项目的公司)与接收者(外包公司)之间的耦合。

下面列举个列子来说明职责链的好处：

天猫每年双11都会做抽奖活动的，比如阿里巴巴想提高大家使用支付宝来支付的话，每一位用户充值500元到支付宝的话，那么可以100%中奖100元红包，

充值200元到支付宝的话，那么可以100%中奖20元的红包，当然如果不充值的话，也可以抽奖，但是概率非常低，基本上是抽不到的，当然也有可能抽到的。

我们下面可以分析下代码中的几个字段值需要来判断：

1. orderType(充值类型)，如果值为1的话，说明是充值500元的用户，如果为2的话，说明是充值200元的用户，如果是3的话，说明是没有充值的用户。
2. isPay(是否已经成功充值了): 如果该值为true的话，说明已经成功充值了，否则的话 说明没有充值成功；就当作普通用户来购买。
3. count(表示数量)；普通用户抽奖，如果数量有的话，就可以拿到优惠卷，否则的话，不能拿到优惠卷。

```
// 我们一般写代码如下处理操作
var order =  function(orderType,isPay,count) {
    if(orderType == 1) {  // 用户充值500元到支付宝去
        if(isPay == true) { // 如果充值成功的话，100%中奖
            console.log("亲爱的用户，您中奖了100元红包了");
        }else {
            // 充值失败，就当作普通用户来处理中奖信息
            if(count > 0) {
                console.log("亲爱的用户，您已抽到10元优惠卷");
            }else {
                console.log("亲爱的用户，请再接再厉哦");
            }
        }
    }else if(orderType == 2) {  // 用户充值200元到支付宝去
        if(isPay == true) {     // 如果充值成功的话，100%中奖
            console.log("亲爱的用户，您中奖了20元红包了");
        }else {
            // 充值失败，就当作普通用户来处理中奖信息
            if(count > 0) {
                console.log("亲爱的用户，您已抽到10元优惠卷");
            }else {
                console.log("亲爱的用户，请再接再厉哦");
            }
        }
    }else if(orderType == 3) {
        // 普通用户来处理中奖信息
        if(count > 0) {
            console.log("亲爱的用户，您已抽到10元优惠卷");
        }else {
            console.log("亲爱的用户，请再接再厉哦");
        }
    }
};
```

上面的代码虽然可以实现需求，但是代码不容易扩展且难以阅读，假如以后我想一两个条件，我想充值300元成功的话，可以中奖150元红包，那么这时候又要改动里面的代码,这样业务逻辑与代码耦合性相对比较高，一不小心就改错了代码；这时候我们试着使用职责链模式来依次传递对象来实现；

如下代码：

```
function order500(orderType,isPay,count){
    if(orderType == 1 && isPay == true)    {
        console.log("亲爱的用户，您中奖了100元红包了");
    }else {
        // 自己不处理，传递给下一个对象order200去处理
        order200(orderType,isPay,count);
    }
};
function order200(orderType,isPay,count) {
    if(orderType == 2 && isPay == true) {
        console.log("亲爱的用户，您中奖了20元红包了");
    }else {
        // 自己不处理，传递给下一个对象普通用户去处理
        orderNormal(orderType,isPay,count);
    }
};
function orderNormal(orderType,isPay,count){
    // 普通用户来处理中奖信息
    if(count > 0) {
        console.log("亲爱的用户，您已抽到10元优惠卷");
    }else {
        console.log("亲爱的用户，请再接再厉哦");
    }
}
```

如上代码我们分别使用了三个函数order500，order200，orderNormal来分别处理自己的业务逻辑，如果目前的自己函数不能处理的事情，我们传递给下面的函数去处理，依次类推，直到有一个函数能处理他，否则的话，该职责链模式直接从链中离开，告诉不能处理，抛出错误提示，上面的代码虽然可以当作职责链模式，但是我们看上面的代码可以看到order500函数内依赖了order200这样的函数，这样就必须有这个函数，也违反了面向对象中的 开放-封闭原则。下面我们继续来理解编写 灵活可拆分的职责链节点。

```
function order500(orderType,isPay,count){
    if(orderType == 1 && isPay == true)    {
        console.log("亲爱的用户，您中奖了100元红包了");
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return "nextSuccessor";
    }
};
function order200(orderType,isPay,count) {
    if(orderType == 2 && isPay == true) {
        console.log("亲爱的用户，您中奖了20元红包了");
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return "nextSuccessor";
    }
};
function orderNormal(orderType,isPay,count){
    // 普通用户来处理中奖信息
    if(count > 0) {
        console.log("亲爱的用户，您已抽到10元优惠卷");
    }else {
        console.log("亲爱的用户，请再接再厉哦");
    }
}
// 下面需要编写职责链模式的封装构造函数方法
var Chain = function(fn){
    this.fn = fn;
    this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor;
}
// 把请求往下传递
Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this,arguments);
    if(ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
}
//现在我们把3个函数分别包装成职责链节点：
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);

// 然后指定节点在职责链中的顺序
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

//最后把请求传递给第一个节点：
chainOrder500.passRequest(1,true,500);  // 亲爱的用户，您中奖了100元红包了
chainOrder500.passRequest(2,true,500);  // 亲爱的用户，您中奖了20元红包了
chainOrder500.passRequest(3,true,500);  // 亲爱的用户，您已抽到10元优惠卷 
chainOrder500.passRequest(1,false,0);   // 亲爱的用户，请再接再厉哦
```

如上代码;分别编写order500，order200，orderNormal三个函数，在函数内分别处理自己的业务逻辑，如果自己的函数不能处理的话，就返回字符串nextSuccessor 往后面传递，然后封装Chain这个构造函数，传递一个fn这个对象实列进来，且有自己的一个属性successor，原型上有2个方法 setNextSuccessor 和 passRequest;setNextSuccessor 这个方法是指定节点在职责链中的顺序的，把相对应的方法保存到this.successor这个属性上，chainOrder500.setNextSuccessor(chainOrder200);chainOrder200.setNextSuccessor(chainOrderNormal);指定链中的顺序，因此this.successor引用了order200这个方法和orderNormal这个方法，因此第一次chainOrder500.passRequest(1,true,500)调用的话，调用order500这个方法，直接输出，第二次调用chainOrder500.passRequest(2,true,500);这个方法从链中首节点order500开始不符合，就返回successor字符串，然后this.successor && this.successor.passRequest.apply(this.successor,arguments);就执行这句代码；上面我们说过this.successor这个属性引用了2个方法 分别为order200和orderNormal，因此调用order200该方法，所以就返回了值，依次类推都是这个原理。那如果以后我们想充值300元的红包的话，我们可以编写order300这个函数，然后实列一下链chain包装起来，指定一下职责链中的顺序即可，里面的业务逻辑不需要做任何处理;

#### 理解异步的职责链

上面的只是同步职责链，我们让每个节点函数同步返回一个特定的值”nextSuccessor”，来表示是否把请求传递给下一个节点，在我们开发中会经常碰到ajax异步请求，请求成功后，需要做某某事情，那么这时候如果我们再套用上面的同步请求的话，就不生效了，下面我们来理解下使用异步的职责链来解决这个问题;我们给Chain类再增加一个原型方法Chain.prototype.next，表示手动传递请求给职责链中的一下个节点。

如下代码：

```
function Fn1() {
    console.log(1);
    return "nextSuccessor";
}
function Fn2() {
    console.log(2);
    var self = this;
    setTimeout(function(){
        self.next();
    },1000);
}
function Fn3() {
    console.log(3);
}
// 下面需要编写职责链模式的封装构造函数方法
var Chain = function(fn){
    this.fn = fn;
    this.successor = null;
};
Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor;
}
// 把请求往下传递
Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this,arguments);
    if(ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
}
Chain.prototype.next = function(){
    return this.successor && this.successor.passRequest.apply(this.successor,arguments);
}
//现在我们把3个函数分别包装成职责链节点：
var chainFn1 = new Chain(Fn1);
var chainFn2 = new Chain(Fn2);
var chainFn3 = new Chain(Fn3);

// 然后指定节点在职责链中的顺序
chainFn1.setNextSuccessor(chainFn2);
chainFn2.setNextSuccessor(chainFn3);

chainFn1.passRequest();  // 打印出1，2 过1秒后 会打印出3
```

调用函数 chainFn1.passRequest();后，会先执行发送者Fn1这个函数 打印出1，然后返回字符串 nextSuccessor;

接着就执行return this.successor && this.successor.passRequest.apply(this.successor,arguments);这个函数到Fn2，打印2，接着里面有一个setTimeout定时器异步函数，需要把请求给职责链中的下一个节点，因此过一秒后会打印出3;

职责链模式的优点是：

  1. 解耦了请求发送者和N个接收者之间的复杂关系，不需要知道链中那个节点能处理你的请求，所以你只需要把请求传递到第一个节点即可。
  2. 链中的节点对象可以灵活地拆分重组，增加或删除一个节点，或者改变节点的位置都是很简单的事情。
  3. 我们还可以手动指定节点的起始位置，并不是说非得要从其实节点开始传递的.

 缺点：职责链模式中多了一点节点对象，可能在某一次请求过程中，大部分节点没有起到实质性作用，他们的作用只是让请求传递下去，从性能方面考虑，避免过长的职责链提高性能。







参考文章:
- https://juejin.im/entry/58c280b1da2f600d8725b887
- https://juejin.im/post/5c984610e51d45656702a785
- https://github.com/melodyJie/something-to-share