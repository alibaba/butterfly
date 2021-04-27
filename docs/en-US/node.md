# Node

## Usage

``` js
const Node = require('butterfly-dag').Node;
class ANode extends Node {
  draw(obj) {
    // here you can custom dom according to your needs.
  }
}

// Initialize draw
canvas.draw({
  nodes: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: ANode // after setting the base class, the canvas will render based on the custom class.
    // the attribute below
    ...
  }]
})

// Dynamic adding node to canvas
canvas.addNode({
  id: 'xxx',
  top: 100,
  left: 100,
  Class: ANode
  // the attribute below
  ...
});
```

<br>
<br>

## attribute：

### id  _`<String>`_    (Require)
&nbsp;&nbsp;unique id
### top  _`<Number>`_    (Require)
&nbsp;&nbsp;y-axis coordinates: the coordinates of the node in the canvas. if it is in the group, it is relative to the internal coordinates of the group
### left _`<Number>`_   (Require)
&nbsp;&nbsp;x-axis coordinates: the coordinates of the node in the canvas. if it is in the group, it is relative to the internal coordinates of the group
### draggable _`<Boolean>`_   (Optional)
&nbsp;&nbsp;set whether the node can be dragged: can override the global draggable attribute
### group _`<String>`_    (Optional)
&nbsp;&nbsp;父级group的id: 设置后该节点会添加到节点组中
### endpoints _`<Array>`_    (Optional)
&nbsp;&nbsp;锚点信息: 当有此配置会加上系统的锚点
### Class _`<Class>`_    (Optional)
&nbsp;&nbsp;拓展类：当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
### scope _`<Boolean>`_    (Optional)
&nbsp;&nbsp;作用域：当scope一致的节点才能拖动进入节点组

```js
// single scope
node.scope = 'xxx';
// multiple scopes, can be connected in any one match
node.scope = 'xxx1 xxx2 xxx3';
```

`* 节点的返回的dom必须设置position: absolute;`

<br>
<br>

## 类重写API：

```js
import {Node} from 'butterfly-dag';

Class YourNode extends Node {
  
  /**
    * 节点挂载后的回调
    */
  mounted() {}

  /**
    * node的渲染方法
    * @param {obj} data - 节点基本信息 
    * @return {dom} - 返回渲染dom的根节点
    */
  draw(obj) {}

}
```

<br>
<br>

## 外部调用API：

### node.getWidth ()

*description*： 获取节点宽度

*return*

* `number`节点宽度

```js
getWidth = () => {}
```

### node.getHeight ()

*description*： 获取节点宽度

*return*

* `number`节点高度

```js
getHeight = () => {}
```

### node.setDraggable (boolean)

*description*： 获取节点是否可移动的状态

*params*

* `boolean`设置节点是否可移动

```js
setDraggable = (boolean) => {}
```

### node.addEndpoint (obj)

*description*： 节点中添加锚点。可添加系统锚点；也可添加节点中的某个dom作为锚点。*注意:*此方法必须在节点挂载后执行才有效

*params*

* `{obj} param` 锚点基本信息(此方法必须在节点挂载后执行才有效)
* `{string} param.id` 锚点id
* `{string} param.orientation` 锚点方向(可控制线段的进入和外出方向)
* `{string} param.scope` 连接作用域
* `{string} param.type` 'source' / 'target' / undefined / 'onlyConnect'，可看锚点的type文档
* `{string} param.dom`可以把节点内的任意一个子dom作为自定义锚点

```js
addEndpoint = (obj) => {}
```

### node.removeEndpoint(string)

*description*：节点中删除锚点

*params*

* `{string} pointId`锚点的Id(此方法必须在节点挂载后执行才有效)

*return*

* ` {Endpoint}`Endpoint的对象

```js
removeEndpoint = (string) => {}
```

### node.getEndpoint (id, type)

*description*：获取节点中的锚点

*params*

* `{string(Require)} pointId`锚点的信息
* `{string(Optional)} type`锚点的信息。若传入type，则会根据锚点id和type完全匹配才能获取到。

*return*

* `{Endpoint}`Endpoint的对象

```
getEndpoint = (id, type) => {}
```

### node.moveTo (obj)

*description*： 节点移动坐标的方法

*params*

* `{number} x `移动位置的x坐标
* `{number} y `移动位置的y坐标

```js
moveTo = (obj) => {}
```

### node.remove ()

*description*： 节点删除的方法。与canvas.removeNode的方法作用一致。

```js
remove = () => {}
```

### node.emit (event, data)

*description*： 节点发送事件的方法，画布及任何一个元素都可接收。

*params*

* `{string} event `发送事件名称
* `{number} data `发送事件数据

```js
emit = (string, obj) => {}
```

### node.on (string, callback)

*description*： 节点接收事件的方法，能接收画布及任何一个元素的事件。

*params*

* `{string} event `接收事件名称
* `{function} data `接收事件回调

```js
on = (string, callback) => {}
```

### [树状布局]treeNode.collapseNode (string)

*description*： 树状节点的节点收缩功能

*params*

* `{string} nodeId`节点id

```js
collapseNode = (string) => {}
```

### [树状布局]treeNode.expandNode (string)

*description*： 树状节点的节点展开功能

*params*

* `{string} nodeId`节点id

```js
expandNode = (string) => {}
```
