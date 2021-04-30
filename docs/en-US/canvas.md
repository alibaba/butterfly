# Canvas

```js
let canvas = new Canvas({
  root: dom,
  theme: {},
  ...
  // the attribute below
});
canvas.draw({
  // data
})
```

<br>
<br>

## attribute

### root _`<dom>`_ (Require)

&nbsp;&nbsp;container: a dom element with width and height, canvas root node
  
### zoomable _`<Boolean>`_   (Optional)

&nbsp;&nbsp;whether the canvas is scalable; value type `boolean`, Default value `false`

### moveable _`<Boolean>`_   (Optional)

&nbsp;&nbsp;whether the canvas is movable; value type `boolean`, Default value `false`

### draggable _`<Boolean>`_   (Optional)

&nbsp;&nbsp;whether the canvas is draggable; value type `boolean`, Default value `false`

### linkable _`<Boolean>`_   (Optional)

&nbsp;&nbsp;whether the nodes in canvas can be dragged to add connection; value type `boolean`, Default value `false`

### disLinkable _`<Boolean>`_   (Optional)

&nbsp;&nbsp;whether the nodes in canvas can be dragged to delete connection; value type `boolean`, Default value `false`

### theme

&nbsp;&nbsp;canvas theme configuration, default initialization style and interaction, mainly:

* edge &nbsp;&nbsp; connection configuration: Default style and interaction of all edges. The dragged edge will also use this configuration.

  *params*：

  * type _`<String>`_ whether the edge is connected to a node or to an endpoint. Default value `endpoint`

  * shapeType _`<String>`_  edge type: Bezier, AdvancedBezier, Flow, Straight, Manhattan; Default value `Straight`

  * label _`<String/Dom>`_ edge label

  * labelPosition _`<Number>`_ edge label position: the value is between 0-1, 0 represents the beginning of the egde, and 1 represents the end of the egde. Default value `0.5`

  * labelOffset _`<Number>`_ the position offset of edge label: the offset value from the label position of edge. The default value is 0, and the unit is `px`

  ```js
  // labelPosition & labelOffset: the label position is in the middle of edge，offset 20px to the end
  {
    labelPosition: 0.5,
    labelOffset: 20
  }
  ```

  * arrow _`<Boolean>`_ whether to add arrow configuration: Default value `true`

  * arrowPosition _`<Number>`_ arrow position: value between 0-1, 0 represents the beginning of the edge, and 1 represents the end of the edge. Default value `0.5`

  * arrowOffset _`<Number>`_ the position offset of arrow: the offset value from the arrow position of edge. The default value is 0, and the unit is `px`

  * isExpandWidth _`<Boolean>`_ expand the edge interaction area, default value `false`. If `true`, get `eventHandlerDom` for attach events

  * defaultAnimate `<Boolean>`_ turn on line animation; Default value `false`

  * Class _`<Class>`_ custom extend class

* endpoint &nbsp;&nbsp; endpoint config: default style and interaction of all endpoints

  *params*：

  * linkableHighlight _`<Boolean>`_  `point.linkable` method will be triggered when connecting, which can be used for line highlighting; Defualt value `true`

  * limitNum _`<Number>`_ limit the number of endpoing connections; Default value `10`

  * expandArea _`<Object>`_ the hot zone connected of endpoint: Since the endpoint area may be too small, it provides the property of expanding the hot zone;Default value `{left: 10, top: 10, right: 10, bottom: 10}`

* group &nbsp;&nbsp; group config

  *params*：

  * type _`<String>`_ group type: `normal`(can be dragged in and out), `inner`(can only be dragged in but not out);Default value `normal`

  * includeGroups _`<Boolean>`_ whether the node group allows included node groups

* zoomGap _`<Number>`_ mouse zoom in and out gap setting; Value between[0-1], Defualt `0.001`

* autoFixCanvas When the node is dragged or the edge is dragged to around the edge of the canvas, the canvas is automatically extended

  *params*：

  * enable _`<Boolean>`_ whether the canvas is automatically extended; Default value `false`

  * autoMovePadding _`<Array>`_ inner margin of the canvas that triggers automatic extension; Default value `[20,20,20,20]`

<img width="600" src="https://img.alicdn.com/tfs/TB16lUNBG61gK0jSZFlXXXDKFXa-1665-801.gif">
  
* autoResizeRootSize _`<Boolean>`_ Automatically adapt to the Root container size; Default value `true`

### global   (Optional)

&nbsp;&nbsp;global	Global attributes; _`object (Option)`_, Default value `undefined`

<br>
<br>

## API

### canvas.draw (data, calllback)

*descripition*：the rendering method of the canvas, `please note that the canvas rendering is asynchronous rendering`

*params*

* `{object} data` include: groups, nodes, edges
* `{function} calllback` `*The rendering process is asynchronous, please pay attention to the callback if you need it`

```js
draw = (data, calllback) => {}
```

### canvas.redraw (data, calllback)

*descripition*：the re-rendering method will delete all previous elements and re-render, `note that the canvas rendering is asynchronous rendering`

*params*

* `{object} data` new groups, new nodes and new edges
* `{function} calllback` `*The rendering process is asynchronous, please pay attention to the callback if you need it`

```js
redraw = (data, calllback) => {}
```

### canvas.getDataMap (data, calllback)

*descripition*：get all the data of the canvas: nodes, edges, groups

*return*

* `{object} data` groups, nodes, and edges data

```js
getDataMap = () => {}
```

### canvas.setLinkable (boolean)

*descripition*：set whether all nodes of the canvas can be dragged to connect edge

*params*

* `{true|false} boolean` whether to support all nodes can be dragged to connect edge
```js
setLinkable = (boolean) => {}
```

### canvas.setDisLinkable (boolean)

*descripition*：set whether all nodes of the canvas can be disconnected connecttion

*params*

* `{true|false} boolean` whether all nodes of the canvas can be disconnected connecttion

```js
setDisLinkable = (boolean) => {}
```

### canvas.setDraggable (boolean)

*descripition*：set whether all nodes of the canvas can be dragged

*params*

* `{true|false} boolean` whether to support all nodes can be dragged

```js
setDraggable = (boolean) => {}
```

### canvas.getGroup (string)

*descripition*：get group by id

*params*

* `{string} id` group id

*return*

* `{Group}` Group instance

```js
getGroup = (string) => {}
```

### canvas.addGroup (object|Group, nodes, options)

*descripition*：添加分组。若分组不存在，则创建分组并把nodes放进分组内；若分组存在，则会把nodes放进当前分组内。

*params*

* `{object | Group} object` 分组: 新建分组信息或Group分组实例
* `{array< object | Node >} object` (Optional)节点信息: 会把这些节点加入到分组内, 若节点不存在会新建节点
* `{object} options` 参数
* `{string} options.posType` 'absolute or relative' , 标识节点的坐标是相对画布的绝对定位还是相对于节点组
* `{number} options.padding` 添加节点组padding

```js
addGroup = (object|Group, nodes, options) => {}
```

此API除了可以新建节点组以外, 还可以做多选成组:

<img width="600" src="https://img.alicdn.com/imgextra/i1/O1CN01S2n8Sy1aayJ8euH7n_!!6000000003347-1-tps-600-400.gif">

### canvas.removeGroup (string | Group)

*descripition* 删除节点组, 但不会删除里面的节点

*params*

* `{string | Group} id` group id / Group实例

*return*

* `{Group}` 删除的对象

```js
removeGroup = (string | Group) => {}
```

### canvas.getNode (string)

*descripition*：根据id获取node

*params*

* `{string} id` node id

*return*

* `{Node}` 节点对象

```js
getNode = (string) => {}
```

### canvas.addNode (object|Node)

*descripition*：添加节点

*params*

* `{object|Node} object` 节点的信息；Node － 节点的基类

```js
addNode = (object|Node) => {}
```

### canvas.addNodes (array<object|Node>)

*descripition*：批量添加节点

*params*

* `{array<object|Node>}` 节点的信息；Node － 节点的基类

```js
addNodes = (array<object|Node>) => {}
```

### canvas.removeNode (string)

*descripition*：删除节点

*params*

* `nodeId string`  - 节点id

```js
removeNode = (string) => {}
```

### canvas.removeNodes (array)

*descripition*：批量删除节点

*params*

* `nodeIds array`  - 批量节点id

```js
removeNodes = (array) => {}
```

### canvas.addEdge (object|Edge)

*descripition*：添加连线

*params*

* `{object|Edge} object`  - 连线的信息；Edge － 连线的基类

```js
addEdge = (object|Edge) => {}
```

### canvas.addEdges (array<object|Edge>)

*descripition*：批量添加连线

*params*

* `{array<object | Edge>}`   - 连线的信息；Edge － 连线的基类

```js
addEdges = (array<object|Edge>) => {}
```

### canvas.removeEdge (param)

*descripition*：根据id或者Edge对象来删除线

*params*

* `{string | Edge} id or Edge`  - 线的id或者Edge对象

*return*

* `{Edge}` - 删除的线

```js
removeEdge = (param) => {}
```

### canvas.removeEdges (param)

*descripition*：根据id或者Edge对象来批量删除线

*params*

* `{array} string or Edge`  - 线的id或者Edge对象的数组

*return*

* `{array} Edge` - 删除的线

```js
removeEdges = (param) => {}
```

### canvas.getNeighborEdges (string)

*descripition*：根据node id获取相邻的edge

*params*

* `{string} nodeId`  - node id

*return*

* `{Edges}` - 相邻的连线

```js
getNeighborEdges = (string) => {}
```

### canvas.getNeighborEdgesByEndpoint (string, string)

*descripition*：根据endpoint id获取相邻的edge

*params*

* `{string} nodeId`  - node id
* `{string} endpointId`  - endpoint id

*return*

* `{Edges}` - 相邻的连线

```js
getNeighborEdgesByEndpoint = (string, string) => {}
```

### canvas.getNeighborNodesAndEdgesByLevel (options)

*descripition*：查找 N 层关联节点和边

*params*

  * `{Object} options` - 参数
  * `{Node} options.node` - 起始节点
  * `{Endpoint} options.endpoint` - 起始锚点，可选
  * `{String} options.type` - 查找方向，可选值为 all\in\out，默认all，可选
  * `{Number} options.level` - 层数，起始节点为第 0 层，默认 Infinity
  * `{Function} options.iteratee` - 是否继续遍历判定函数，返回 boolean 值

*return*

* `{Object<nodes: Node, edges: Edge>} filteredGraph` - 查找结果

```js
getNeighborNodesAndEdgesByLevel = (options) => {}
```

### canvas.setEdgeZIndex (edges, zIndex)

*descripition*：设置线段z-index属性

*params*

* `{Array<Edge>} edges` - 线段
* `{number} zIndex` - z-index的值

```js
setEdgeZIndex = (edges, zIndex) => {}
```

### canvas.setZoomable (boolean, boolean)

*descripition*：设置画布缩放

*params*

* `{true|false} boolean`  - 是否支持画布缩放
* `{true|false} boolean`  - 放大缩小方向。现在默认为MAC的双指方向，却于Window的鼠标滑轮方向相反。默认值：false。若true，则方向相反

```js
setZoomable = (boolean, boolean) => {}}
```

### canvas.setMoveable (boolean)

*descripition*：设置画布平移

*params*

* `{true|false} boolean`  - 是否支持画布平移

```js
setMoveable = (boolean) => {}
```

### canvas.move  (postion)

*descripition*：手动设置画布偏移

*params*

* `{[x, y]} array`  - x,y坐标

```js
move = (postion) => {}
```

### canvas.zoom (scale)

*descripition*：手动设置画布缩放

*params*

* `{float} scale` - 0-1之间的缩放值
* `{function} callback`  - 缩放后的回调

```js
zoom = (scale) => {}
```

### canvas.getZoom ()

*descripition*：获取画布的缩放

*return*

* `{float}` - 画布的缩放(0-1)

```js
getZoom = () => {}
```

### canvas.getOffset ()

*descripition*：获取画布的偏移值

*return*

* `{[x, y]}` - 画布的偏移值

```js
getOffset = () => {}
```

### canvas.getOrigin ()

*descripition*：获取画布的偏移值的中心点

*return*

* `{[x, y]}` - 画布的偏移值的中心点(百分比)

```js
getOrigin = () => {}
```

### canvas.setOrigin ([x ,y])

*descripition*：手动设置画布缩放的中心点

*params*

* `{[x, y]} array` - x,y的中心点坐标

```js
setOrigin = ([x ,y]) => {}
```

### canvas.focusNodeWithAnimate (string, type, options, callback)

*descripition*：聚焦某个节点/节点组

*params*

* `{string/function} nodeId/groupId or filter`  - 节点的id或者过滤器
* `{string} type`  - 节点的类型(node or group)
* `{object} options {offset: [0,0]}`  - 聚焦配置属性，如偏移值
* `{function} callback`  - 聚焦后的回调

```js
focusNodeWithAnimate = (string, type, options, callback) => {}
```

### canvas.focusNodesWithAnimate (objs, type, options, callback)

*descripition*：聚焦某多个节点/节点组

*params*

* `{object} {nodes: [], groups: []}`  - 节点和节点组的id数组
* `{array} type`  - 节点的类型(node or group)
* `{object} options {offset: [0,0]}`  - 聚焦配置属性，如偏移值
* `{function} callback`  - 聚焦后的回调

```js
focusNodesWithAnimate = (objs, type, options, callback) => {}
```

### canvas.focusCenterWithAnimate (options, callback)

*descripition*：聚焦整个画布，会自动调整画布位置和缩放

*params*

* `{object} options {offset: [0,0]}`  - 聚焦配置属性，如偏移值
* `{function} callback`  - 聚焦后的回调

```js
focusCenterWithAnimate = (options, callback) => {}
```

<img width="600" src="https://img.alicdn.com/imgextra/i2/O1CN01zrkUqk1SP34Sup0vt_!!6000000002238-1-tps-1661-824.gif">

### canvas.redo ()

*descripition*：重做操作

```js
redo = () => {}
```

### canvas.undo ()

*descripition*：回退操作

```js
undo = () => {}
```

### canvas.pushActionQueue (options)

*descripition*：给操作队列(undo/redo的队列)新增最顶部元素

*params*
* `{Object} options` - 参数
* `{String} options.type` - 队列类型
* `{Object} options.data` - 队列数据

```js
pushActionQueue = (options) => {}
```

### canvas.popActionQueue (options)

*descripition*：给操作队列(undo/redo的队列)删除最顶部元素

```js
popActionQueue = (options) => {}
```

### canvas.clearActionQueue (options)

*descripition*：清除操作队列(undo/redo的队列)

```js
clearActionQueue = (options) => {}
```

### canvas.terminal2canvas (coordinates)

*descripition*：屏幕转换为画布的坐标

*params*

* `{array<number>} coordinates` - 需要换算的坐标([x,y])

*return*

* `{number}` - 转换后的坐标

```js
terminal2canvas = (coordinates) => {}
```

### canvas.canvas2terminal (coordinates)

*descripition*：画布转换为屏幕的坐标

*params*

* `{array<number>} coordinates` - 需要换算的坐标([x,y])

*return*

* `{number}` - 转换后的坐标


```js
canvas2terminal = (coordinates) => {}
```

*描述*

* 如图所示，画布缩放，移动后的坐标和原来画布的坐标并不匹配，需要此方法来转换。特别注意：有拖动添加节点的用户们注意这两个`e.clientX`和`e.clientY`，需要调用此方法进行转换。

<img width="600" src="http://img.alicdn.com/tfs/TB1lWIAFHvpK1RjSZPiXXbmwXXa-973-850.jpg">


### canvas.setSelectMode (boolean, contents , selecMode)

*descripition*：设置框选模式: 注意, 注意框选模式和普通拖动画布模式是互斥的, 没办法同时设置

*params*

* `{true|false} boolean`  - 是否开启框选功能
* `{array} contents` - 可接受框选的内容(node|endpoint|edge),默认'node')
* `{string} selecMode` - 可接受框选的内容(include|touch|senior),默认'include',include:全部包含才可选中，touch:触碰就选中，senior:从左到右需要全部包含，从右到左只需触碰就能选中)

```js
setSelectMode = (boolean, contents , selecMode) => {}
```

### canvas.getUnion (name)

*descripition*：获取聚合组

*params*

* `{name} string`  - 聚合组的名称

```js
getUnion = (name) => {}
```

### canvas.getAllUnion ()

*descripition*：获取所有聚合组

```js
getAllUnion = () => {}
```

### canvas.add2Union (name, obj)

*descripition*：添加聚合组 || 添加聚合组元素

*params*

* `{name} string`  - 聚合组名称。假如不存在，则添加聚合组；假如已存在，则添加聚合组元素
* `{obj} object`  - 聚合组的元素

```js
add2Union = (name, obj) => {}

this.canvas.add2Union('我的聚合组', {
  nodes: []     // Node对象或者nodeId
  groups: []    // Group对象或者groupId
  edges: []     // Edge对象或者edgeId
  endpoints: [] // Endpoint对象
});
```

### canvas.removeUnion (name)

*descripition*：去除聚合组

*params*

* `{name} string`  - 聚合组的名称

```js
removeUnion = (name) => {}
```

### canvas.removeAllUnion ()

*descripition*：去除所有聚合组

```js
removeAllUnion = () => {}
```

<br>
<br>

## 事件

```js
let canvas = new Canvas({...});
canvas.on('type key', (data) => {
  //data 数据
});
```
*参数key值*

* `system.canvas.click` 点击画布空白处
* `system.canvas.zoom`	画布缩放
* `system.nodes.delete`	删除节点
* `system.node.move`	移动节点
* `system.nodes.add`	批量节点添加
* `system.links.delete`	删除连线
* `system.link.connect`	连线成功
* `system.link.reconnect`	线段重连
* `system.link.click`	点击事件
* `system.group.delete`	删除节点组
* `system.group.move`	移动节点组
* `system.group.addMembers`	节点组添加节点
* `system.group.removeMembers`	节点组删除节点
* `system.multiple.select`	框选结果
* `system.drag.start`	拖动开始
* `system.drag.move`	拖动
* `system.drag.end`	拖动结束

```js
/**
  * 发送事件
  */
emit = (string, obj) => {}

/**
  * 接受事件
  */
on = (string, callback) => {}
```

<br>
<br>

## 其他辅助方法

### canvas.setGirdMode (show, options)

*descripition*：设置网格布局

*params*

* `{true|false} boolean`  - 是否开启网格布局功能
* `{array} options` - 网格布局的定制化参数

```js
setGirdMode = (show, options) => {}

this.canvas.setGirdMode(true, {
  isAdsorb: false,         // 是否自动吸附,默认关闭
  theme: {
    shapeType: 'line',     // 展示的类型，支持line & circle
    gap: 23,               // 网格间隙
    adsorbGap: 8,          // 吸附间距
    backgroud: '#fff',     // 网格背景颜色
    lineColor: '#000',     // 网格线条颜色
    lineWidth: 1,          // 网格粗细
    circleRadiu: 1,        // 圆点半径
    circleColor: '#000'    // 圆点颜色
  }
});
```

### canvas.setMinimap = (show, options)

*descripition*：设置缩略图

*params*

* `{true|false} boolean`  - 是否开启缩略图功能
* `{Object}` 具体请参考缩略图章节

```js
setMinimap = (show, options) => {}
```

### canvas.save2img (options)

*descripition*：画布保存为图片

*params*

* `{object=} options` - 保存的图片参数，可选
* `{string=} options.type` - 图片格式(png/jpeg/svg,默认png)，可选
* `{number=} options.quality` - 图片质量(0~1，默认为1)，可选
* `{number=} options.width` - 图片宽度(默认为画布宽度)，可选
* `{number=} options.height` - 图片高度(默认为画布高度)，可选\

*return*

* `{Promise}`

```js
save2img = (options) => {}

this.canvas.save2img({type: 'png', width: 1920, height: 1080, quality: 1})
  .then(dataUrl => {
    var link = document.createElement('a');
    link.download = 'XXX.png';
    link.href = dataUrl;
    link.click();
  });
```

### canvas.justifyCoordinate ()

*descripition*：把画布上的节点，节点组自动对齐(必须在网格布局下才生效)

```js
justifyCoordinate = () => {}
```

### canvas.setGuideLine (show, options)

*descripition*：设置辅助线

*params*

* `{true|false} boolean`  - 是否开启辅助线功能
* `{array} options` - 辅助线的定制化参数

```js
setGuideLine = (show, options) => {}

this.canvas.setGuideLine(true, {
  limit: 1,             // 限制辅助线条数
  theme: {
    lineColor: 'red',   // 网格线条颜色
    lineWidth: 1,       // 网格粗细
  }
});
```

### canvas.updateRootResize ()

*descripition*：当root移动或者大小发生变化时需要更新位置

```js
updateRootResize = () => {}
```