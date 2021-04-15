# 节点组(Group)

```js
const Group = require('butterfly-dag').Group;
class AGroup extends Group {
  draw(obj) {
    // 这里可以根据业务需要，自己生成dom
  }
}

// 初始化画布渲染
canvas.draw({
  groups: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: AGroup //设置基类之后，画布会根据自定义的类来渲染
    ...
    // 参考下面属性
  }],
  nodes: ...
  edges: ...
})

// 动态添加
canvas.addGroup({
  ...
  // 参考下面属性
});
```

# 属性

### id _`<String>`_ （必填）
  节点唯一标识
### top _`<Number>`_ （必填）
   y轴坐标
### left _`<Number>`_ （必填）
  x轴坐标
### width _`<Number>`_ (选填)
  宽度
### height _`<Number>`_ (选填)
  高度
### type _`<String>`_ (选填)
  类型
### endpoints _`<Array>`_ (选填)
  锚点信息
### Class _`<Class>`_ (选填)
  拓展类
### scope _`<String>`_ (选填)
  作用域

`* 节点的返回的dom必须设置position: absolute;`



# API：

### group.draw (obj)

*参数*

* `data`节点基本信息

*返回*

* `dom`返回渲染dom的根节点

```js
draw = (obj) => {}
```

### group.mounted()

```js
mounted = () => {}
```

### group.getWidth ()

*返回*

* `number`节点组宽度

```js
getWidth = () => {}
```

### group.getHeight ()

*返回*

* `number`节点组高度

```js
getHeight = () => {}
```

### group.addNode (node)

*参数*

* `{obj} node`节点数据

```js
addNode = (node) => {}
```

### group.addNodes (nodes)

*参数*

* `{array} nodes`节点数组

```js
addNodes = (nodes) => {}
```

### group.removeNode (node)

*参数*

* `{obj} node`节点数据

```js
removeNode = (node) => {}
```

### group.removeNode (node)

*参数*

* `{obj} node`节点数据

```js
removeNode = (node) => {}
```

### group.addEndpoint (obj)

*参数*

* `{obj} param`锚点基本信息(此方法必须在节点挂载后执行才有效)
* `{string} param.id`锚点id
* `{string} param.orientation`锚点方向(可控制线段的进行和外出方向)
* `{string} param.scope`作用域
* `{string} param.type`'source' / 'target' / undefined，当undefined的时候锚点既是source又是target
* `{string} param.dom`可以把分组内的任意一个子dom作为自定义锚点

```js
addEndpoint = (obj) => {}
```

### group.getEndpoint (id)

*参数*

* `{string} pointId`锚点的信息 

*返回*

* `{Endpoint}`Endpoint的对象

```js
getEndpoint = (id) => {}
```

### group.moveTo (obj)

*参数*

* `{number} x `移动位置的x坐标
* `{number} y `移动位置的y坐标

```js
moveTo = (obj) => {}
```

### group.emit (event, data)

* `{string} event `发送事件名称
* `{number} data `发送事件数据

```js
emit = (string, obj) => {}
```

### group.on (string, callback)

* `{string} event `接收事件名称
* `{function} data `接收事件回调

```js
on = (string, callback) => {}
```

