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

// 用法二:
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

节点唯一标识


### orientation _`<Array>`_（选填）

方向: (1) 控制系统锚点方向 (2) 控制线段的出入口方向

* 下: [0,1]
* 上: [0,-1]
* 右: [1,0]
* 左: [-1,0]


### pos _`<Array>`_ (选填)

位置: 控制系统锚点位置

取值: [0-1之间 , 0-1之间]


### type _`<String>`_ (选填)

锚点类型: 

* source: 来源锚点。线段只出不入
* target: 目标锚点。线段只入不出
* undefined: 未定义锚点。线段能入能出，但取决于第一根连线是入还是出
* onlyConnect: 不能拖动断开线的锚点。线段能入能出，但拖动断开线


### scope _`<String>`_ (选填)

作用域: 锚点之间scope相同才可以连线。

```js
// 单scope
endpoint.scope = 'xxx';
// 多scope，任意一个匹配中都能连接
endpoint.scope = 'xxx1 xxx2 xxx3';

```


### disLinkable _`<Boolean >`_ (选填)

禁止锚点拖动断开线段


### expandArea _`<Object>`_ (选填)

锚点连接的热区: 由于锚点区域有可能过小，所以提供了热区扩大的属性。此外，此属性可覆盖canvas中的主题属性。

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



### limitNum _`<Number>`_ (选填)

连线数目限制


### connectedNum _`<Number>`_ (选填)

已连接线段数量


### dom _`<Dom>`_ (选填)

自定义锚点dom: 假如传入此参数，则这个dom将成为锚点

```js
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom,
  ...
});
```


### Class _`<Class>`_ (选填)

扩展类


### root _`<String>`_ (选填)

可把锚点附属于某个子元素


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

<br>
<br>

## 外部调用API

### endpoint.updatePos(dom,orientation,pos)

*参数*

* `{dom} dom`自定义锚点
* `{array} orientation `方向
* `{array} pos`位置

```js
updatePos = (dom,orientation,pos) => {}
```

### endpoint.moveTo ()

*参数*

* `{number} x`移动位置的x坐标
* `{number} y`移动位置的y坐标

```js
moveTo = (obj) => {}
```

### endpoint.hasConnection()

```js
/**
  * 该endpoint是否有连接边
  */
hasConnection = () => {}
```

### endpoint.emit(event,data)

* `{string} event`发送事件名称
* `{number} data`发送事件数据

```js
emit = (string, obj) => {}
```

### endpoint.on(event,callback)

* `{string} event`接收事件名称
* `{function} callback`接收事件回调

```js
on = (string, function) => {}
```