# 节点(Node)

## 用法

``` js
const Node = require('butterfly-dag').Node;

// 当canvas为TreeCanvas时可选TreeNode
// const TreeNode = require('butterfly-dag').TreeNode;
class ANode extends Node {
  draw(obj) {
    // 这里可以根据业务需要，自己生成dom
  }
}

// 初始化画布渲染
canvas.draw({
  nodes: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: ANode //设置基类之后，画布会根据自定义的类来渲染
    // 参考下面属性
    ...
  }]
})

// 动态添加
canvas.addNode({
  id: 'xxx',
  top: 100,
  left: 100,
  Class: ANode
  // 参考下面属性
  ...
});
```

<br>
<br>

## 属性<a name='node-attr'></a>

### id  _`<String>`_    (必填)
&nbsp;&nbsp;节点唯一标识
### top  _`<Number>`_    (必填)
&nbsp;&nbsp;y轴坐标: 节点所在画布的坐标；若在节点组中，则是相对于节点组内部的坐标
### left _`<Number>`_   (必填)
&nbsp;&nbsp;x轴坐标: 节点所在画布的坐标；若在节点组中，则是相对于节点组内部的坐标
### draggable _`<Boolean>`_   (选填)
&nbsp;&nbsp;设置该节点是否能拖动：为可覆盖全局的draggable属性
### group _`<String>`_    (选填)
&nbsp;&nbsp;父级group的id: 设置后该节点会添加到节点组中
### endpoints _`<Array>`_    (选填)
&nbsp;&nbsp;系统锚点配置: 当有此配置会加上系统的锚点
### Class _`<Class>`_    (选填)
&nbsp;&nbsp;拓展类：当传入拓展类的时候，该节点则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
### scope _`<Boolean>`_    (选填)
&nbsp;&nbsp;作用域：当scope一致的节点才能拖动进入节点组

```js
// 单scope
node.scope = 'xxx';
// 多scope，任意一个匹配中都能连接
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

*作用*： 获取节点宽度

*返回*

* `number`节点宽度

/**
  * @return {number} - 节点宽度
  */
getWidth = () => {}
```

### node.getHeight ()

*作用*： 获取节点宽度

*返回*

/**
  * @return {number} - 节点高度
  */
getHeight = () => {}

*作用*： 获取节点是否可移动的状态

*参数*

* `boolean`设置节点是否可移动

```js
setDraggable = (boolean) => {}

### node.addEndpoint (obj)

*作用*： 节点中添加锚点。可添加系统锚点；也可添加节点中的某个dom作为锚点。*注意:*此方法必须在节点挂载后执行才有效

*参数*

* `{obj} param` 锚点基本信息(此方法必须在节点挂载后执行才有效)
* `{string} param.id` 锚点id
* `{string} param.orientation` 锚点方向(可控制线段的进入和外出方向)
* `{string} param.scope` 连接作用域
* `{string} param.type` 'source' / 'target' / undefined / 'onlyConnect'，可看锚点的type文档
* `{string} param.dom`可以把节点内的任意一个子dom作为自定义锚点

```js
/**
  * @param {obj} param - 锚点基本信息(此方法必须在节点挂载后执行才有效)
  * @param {string} param.id - 锚点id
  * @param {string} param.orientation - 锚点方向(可控制线段的进行和外出方向)
  * @param {string} param.scope - 作用域
  * @param {string} param.type - 'source' / 'target' / undefined / 'onlyConnect'。 当undefined的时候锚点既是source又是target，但不能为同是为'source'和'target'，先来先到 ; 'onlyConnect'，锚点既是source又是target，可同时存在
  * @param {string} param.dom - 可以把节点内的任意一个子dom作为自定义锚点
  */
addEndpoint = (obj) => {}
```

### node.removeEndpoint(string)

*作用*：节点中删除锚点

*参数*

* `{string} pointId`锚点的Id(此方法必须在节点挂载后执行才有效)

*返回*

* ` {Endpoint}`Endpoint的对象

```js
removeEndpoint = (string) => {}
```

### node.getEndpoint (id, type)

*作用*：获取节点中的锚点

*参数*

* `{string(必填)} pointId`锚点的信息
* `{string(选填)} type`锚点的信息。若传入type，则会根据锚点id和type完全匹配才能获取到。

*返回*

* `{Endpoint}`Endpoint的对象

```
getEndpoint = (id, type) => {}
```

### node.moveTo (x, y)

*作用*： 节点移动坐标的方法

*参数*

* `{number} x `移动位置的x坐标
* `{number} y `移动位置的y坐标

```js
/**
  * 移动节点
  * @param {Array} obj 坐标，例如 [0, 1]
  * @param {number} x - 移动位置的x坐标 
  * @param {number} y - 移动位置的y坐标 
  */
moveTo = (x, y) => {}
```

### node.remove ()

*作用*： 节点删除的方法。与canvas.removeNode的方法作用一致。

```js
remove = () => {}
```

### node.emit (event, data)

*作用*： 节点发送事件的方法，画布及任何一个元素都可接收。

*参数*

* `{string} event `发送事件名称
* `{number} data `发送事件数据

```js
/**
  * 发送事件
  */
emit = (string, obj) => {}

### node.on (string, callback)

*作用*： 节点接收事件的方法，能接收画布及任何一个元素的事件。

*参数*

* `{string} event `接收事件名称
* `{function} data `接收事件回调

```js
on = (string, callback) => {}
```

### [树状布局]treeNode.collapseNode (string)

*作用*： 树状节点的节点收缩功能

*参数*

* `{string} nodeId`节点id

```js
/**
  * [树状布局] 收缩节点
  * @param {string} nodeId - 节点id 
  */
collapseNode = (string) => {}
```

### [树状布局]treeNode.expandNode (string)

*作用*： 树状节点的节点展开功能

*参数*

* `{string} nodeId`节点id

```js
expandNode = (string) => {}
```
