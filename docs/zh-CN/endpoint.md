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

## 属性

### id  _`<String>`_ (必填)

节点唯一标识

### orientation _`<Array>`_（选填）

方向

取值：下:[0,1]/上:[0,-1]/右:[1,0]/左:[-1,0],除了控制系统锚点方向，而且能控制线段的出入口方向

### pos _`<Array>`_ (选填)

位置

### type _`<String>`_ (选填)

目标锚点还是源锚点

取值：'source' / 'target' / undefined / 'onlyConnect'，当undefined的时候锚点既是source又是target；当onlyConnect的时候锚点既是source又是target，但锚点不能拖动删除线段

### root _`<String>`_ (选填)

可把锚点附属于某个子元素

### scope _`<String>`_ (选填)

作用域（锚点scope相同才可以连线）

### expandArea _`<Object>`_ (选填)

可以设置锚点连接的热区，可覆盖主题内的设置


### limitNum _`<Number>`_ (选填)

连线数目限制

### connectedNum _`<Number>`_ (选填)

已连接数

### dom _`<Dom>`_ (选填)

可以把此dom作为自定义锚点

### disLinkable _`<Boolean >`_ (选填)

禁止锚点拖动断开线段

### Class _`<Class>`_ (选填)

扩展类

## API

### endpoint.draw(obj)

*参数*

* `obj`节点基本信息

*返回*

* `dom`返回自定义节点的dom

```js
draw = (obj) => {}
```

### endpoint.mounted()

```js
/**
  * 锚点挂载后的回调
  */
mounted = () => {}
```

### endpoint.updated ()

```js
/**
  * 锚点更新后的回调
  */
updated = () => {}
```

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

### endpoint.linkable()

```js
/**
  * 设置连线时linkable的状态 (需要设置this.theme.endpoint.linkableHighlight属性)
  */
linkable = () => {}
```

### endpoint.unLinkable()

```js
/**
  * 取消连线时linkable的状态
  */
unLinkable = () => {}
```

### endpoint.hoverLinkable()

```js
/**
  * 设置连线时linkable并且hover状态 (需要设置this.theme.endpoint.linkableHighlight属性)
  */
hoverLinkable = () => {}
```

### endpoint.unHoverLinkable()

```js
/**
  * 取消连线时linkable并且hover状态
  */
unHoverLinkable = () => {}
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

