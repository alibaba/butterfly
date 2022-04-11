# 锚点(Endpoint)

## 用法

```js
// 用法一:
canvas.draw({
  nodes: [{
    ...
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }]
})

// 用法二: 此方法必须在node的mount挂载后才能使用
let node = this.canvas.getNode('xxx');
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom           // 使用此属性用户可以使用任意的一个dom作为一个锚点
});
```

<br>
<br>

## 属性

### id  _`<String>`_ (必填)

&nbsp;&nbsp;节点唯一标识


### orientation _`<Array>`_（选填）

&nbsp;&nbsp;方向: (1) 控制系统锚点方向 (2) 控制线段的出入口方向

* 下: [0,1]
* 上: [0,-1]
* 右: [1,0]
* 左: [-1,0]

<img width="650" src="https://img.alicdn.com/imgextra/i2/O1CN01UcRB7j1nQWGvFm1jM_!!6000000005084-0-tps-800-460.jpg">

### pos _`<Array>`_ (选填)

&nbsp;&nbsp;位置: 控制系统锚点位置。可配合orientation使用，控制系统锚点

&nbsp;&nbsp;取值: [0-1之间 , 0-1之间]，0代表最左/上侧，1代表最右/下侧

<img width="650" src="https://img.alicdn.com/imgextra/i3/O1CN012Z29af27tdlsRTaiC_!!6000000007855-0-tps-800-460.jpg">

### type _`<String>`_ (选填)

&nbsp;&nbsp;锚点类型: 

* source: 来源锚点。线段只出不入
* target: 目标锚点。线段只入不出
* undefined: 未定义锚点。线段能入能出，但取决于第一根连线是入还是出
* onlyConnect: 不能拖动断开线的锚点。线段能入能出，但拖动断开线


### scope _`<String>`_ (选填)

&nbsp;&nbsp;作用域: 锚点之间scope相同才可以连线。

```js
// 单scope
endpoint.scope = 'xxx';
// 多scope，任意一个匹配中都能连接
endpoint.scope = 'xxx1 xxx2 xxx3';
```

### disLinkable _`<Boolean >`_ (选填)

&nbsp;&nbsp;禁止锚点拖动断开线段


### expandArea _`<Object>`_ (选填)

&nbsp;&nbsp;锚点连接的热区: 由于锚点区域有可能过小，所以提供了热区扩大的属性。此外，此属性可覆盖canvas中的主题属性。

```js
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  expandArea: {
    left: 10,
    right: 10,
    top: 10,
    botton: 10
  }
  ...
});
```

<img width="650" src="https://img.alicdn.com/imgextra/i1/O1CN01x8cvVc1oQo8daQTji_!!6000000005220-1-tps-600-400.gif">


### limitNum _`<Number>`_ (选填)

&nbsp;&nbsp;连线数目限制


### connectedNum _`<Number>`_ (选填)

&nbsp;&nbsp;已连接线段数量


### dom _`<Dom>`_ (选填)

&nbsp;&nbsp;自定义锚点dom: 假如传入此参数，则这个dom将成为锚点

```js
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom,
  ...
});
```


### Class _`<Class>`_ (选填)

&nbsp;&nbsp;扩展类


### root _`<String>`_ (选填)

&nbsp;&nbsp;可把锚点附属于某个子元素


<br>
<br>


## 类重写API：
```js
import {Endpoint} from 'butterfly-dag';

Class YourEndpoint extends Endpoint {

  /**
    * 锚点挂载后的回调
    */
  mount() {}
  
  /**
    * endpoint的渲染方法
    * @param {obj} data - 节点基本信息 
    * @return {dom} - 返回渲染dom的根节点
    */
  draw(obj) {}
  
  /**
    * 拖动锚点时设置连线时linkable的状态回调，可定义linkable样式 
    * (需要设置this.theme.endpoint.linkableHighlight属性才能触发此回调)
    */
  linkable() {}
  
  /**
    * 释放鼠标取消连线时linkable的状态回调，可定义取消线段样式清除
    * (与linkable对应配合使用)
    */
  unLinkable() {}
  
  /**
    * 拖动锚点时设置连线时linkable并且hover到此锚点的状态回调，可定义linkable的hover状态样式 
    * (与linkable对应配合使用)
    */
  hoverLinkable() {}
  
  /**
    * 释放鼠标取消连线时linkable并且hover状态回调，可定义取消线段linkable的hover状态的样式清楚
    * (与hoverLinkable对应配合使用)
    */
  unHoverLinkable() {}
}
```

### linkable & unLinkable


<img width="650" src="https://img.alicdn.com/imgextra/i2/O1CN01VNQ3v621www2JIRhN_!!6000000007050-1-tps-400-300.gif">

### hoverLinkable & unHoverLinkable

<img width="650" src="https://img.alicdn.com/imgextra/i4/O1CN01428w4x27Z1weiMNVy_!!6000000007810-1-tps-400-300.gif">

<br>
<br>

## 外部调用API

### endpoint.updatePos(dom,orientation,pos)

*作用*： 当锚点位置发生变化时，需要调用此方法更新锚点的位置并更新相邻的线段

*参数*

* `{dom} dom`自定义锚点
* `{array} orientation `方向
* `{array} pos`位置

```js
updatePos = (dom,orientation,pos) => {}
```

### endpoint.moveTo ()

*作用*： 锚点移动坐标的方法

*参数*

* `{number} x`移动位置的x坐标
* `{number} y`移动位置的y坐标

```js
moveTo = (obj) => {}
```

### endpoint.hasConnection()

*作用*： 判断锚点是否有线段连接

*返回*

* `boolean`

```js
/**
  * 该endpoint是否有连接边
  */
hasConnection = () => {}
```

### endpoint.emit(event,data)

*作用*： 锚点发送事件的方法，画布及任何一个元素都可接收。

*参数*

* `{string} event`发送事件名称
* `{number} data`发送事件数据

```js
emit = (string, obj) => {}
```

### endpoint.on(event,callback)

*作用*： 锚点接收事件的方法，能接收画布及任何一个元素的事件。

*参数*

* `{string} event`接收事件名称
* `{function} callback`接收事件回调

```js
on = (string, function) => {}
```