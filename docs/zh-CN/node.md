# 节点(Node)

## 用法
``` js
const Node = require('butterfly-dag').Node;
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

## 属性

### id  _`<String>`_    (必填)
  节点唯一标识
### top  _`<Number>`_    (必填)
   y轴坐标
### left _`<Number>`_   (必填)
  x轴坐标
### draggable _`<Boolean>`_   (选填)
  可以设置该节点是否能拖动：为可覆盖全局的draggable属性
### group _`<String>`_    (选填)
  group的唯一标识
### endpoints _`<Array>`_    (选填)
  锚点信息: 当有此配置会加上系统的锚点
### Class _`<Class>`_    (选填)
  拓展类：当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
### scope _`<Boolean>`_    (选填)
  作用域：当scope一致的节点才能拖动进入节点组

```js
// 单scope
node.scope = 'xxx';
// 多scope，任意一个匹配中都能连接
node.scope = 'xxx1 xxx2 xxx3';
```

`* 节点的返回的dom必须设置position: absolute;`

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
  
  /**
    * 节点更新后的回调
    */
  updated() {}
  /**
    * 删除节点
    */
  remove() {}
}
```

## 外部调用API：

### node.getWidth ()

返回

* `number`节点宽度

```js
getWidth = () => {}
```

### node.getHeight ()

返回

* `number`节点高度

```js
getHeight = () => {}
```

### node.setDraggable (boolean)

参数

* `boolean`设置节点是否可移动

```js
setDraggable = (boolean) => {}
```

### node.focus()

```js
focus = () => {}
```

### node.unFocus()

```js
unFocus = () => {}
```

### node.addEndpoint (obj)

参数

* `{obj} param`锚点基本信息(此方法必须在节点挂载后执行才有效)
* `{string} param.id`锚点id
* `{string} param.orientation`锚点方向(可控制线段的进行和外出方向)
* `{string} param.scope`作用域
* `{string} param.type` 'source' / 'target' / undefined / 'onlyConnect'。 当undefined的时候锚点既是source又是target，但不能为同是为'source'和'target'，先来先到 ; 'onlyConnect'，锚点既是source又是target，可同时存在
* `{string} param.dom`可以把分组内的任意一个子dom作为自定义锚点

```js
addEndpoint = (obj) => {}
```

### node.removeEndpoint(obj)

参数

* `{string} pointId`锚点的Id(此方法必须在节点挂载后执行才有效)

返回

* ` {Endpoint}`Endpoint的对象

```js
removeEndpoint = (obj) => {}
```

### node.getEndpoint (id, type)

参数

* `{string(必填)} pointId`锚点的信息
* `{string(选填)} type`锚点的信息

返回

* `{Endpoint}`Endpoint的对象

```
getEndpoint = (id, type) => {}
```

### node.moveTo (obj)

参数

* `{number} x `移动位置的x坐标
* `{number} y `移动位置的y坐标

```js
moveTo = (obj) => {}
```

### node.emit (event, data)

* `{string} event` 发送事件名称
* `{obj}data` 发送事件数据

```js
emit = (string, obj) => {}
```

### node.on (string, callback)

* `{string} event` 接收事件名称
* `{function}data` 接收事件数据

```js
on = (string, callback) => {}
```

### node.collapseNode (string)

参数

* `{string} nodeId`节点id

```js
collapseNode = (string) => {}
```

### node.expandNode (string)

参数

* `{string} nodeId`节点id

```js
expandNode = (string) => {}
```