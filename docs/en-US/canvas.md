# Canvas

```js
let canvas = new Canvas({
  // the attribute below
  root: dom,               // canvas root dom (require)
  layout: 'ForceLayout',   // layout setting , integrated or custom , (optional)
  zoomable: true,          // enable zoom canvas (optional)
  moveable: true,          // enable move canvas (optional)
  draggable: true,         // enable drag nodes (optional)
  linkable: true,          // enable connect edges (optional)
  disLinkable: true,       // enable disConnect edges (optional)
  layout: {},              // initialize auto layout (optional)
  theme: {                 // theme (optional) 
    group: {
      type: 'normal',       // Node group type: normal (drag in and drag out), inner (can only be dragged in and not out)
      dragGroupZIndex: 50  // Node group z-index: (optional, Default:50)
    },
    node: {
      dragNodeZIndex: 250  //node z-index/2 (optional, Default:250)
    },
    edge: {
      type: 'endpoint',    // edge connection type
      shapeType: 'Bezier', // edge type：Bezier curve，Polyline ，Straight，Manhattan line，Improved Bezier curve。values ： Bezier/Flow/Straight/Manhattan/AdvancedBezier
      label: 'test',       // edge label
      arrow: true,         // whether to show arrow
      arrowPosition: 0.5,  // arrow position (0 ~ 1)
      arrowOffset: 0.0,    // arrow offset
      arrowShapeType: '',  // custom arrow style
      Class: XXClass,      // custom Class
      isExpandWidth: false,// expand line interaction area
      defaultAnimate: false,// turn on line animation by default
      dragEdgeZindex: 499  // edge z-index (optional, Default:490)
    },
    endpoint: {
      position: [],        // limit endpoint position ['Top', 'Bottom', 'Left', 'Right'],
      linkableHighlight: true,// point.linkable method is triggered when connecting, can be highlighted
      limitNum: 10,        // limit the number of anchor connections
      expandArea: {        // when the anchor point is too small, the connection hot zone can be expanded.
        left: 10,
        right: 10,
        top: 10,
        botton: 10
      }
    },
    zoomGap: 0.001,       // mouse zoom in and out gap settings
    autoFixCanvas: {     // auto expand canvas when drag nodes or edges near the edge of canvas.
      enable: false,
      autoMovePadding: [20, 20, 20, 20]
    },
    autoResizeRootSize: true // automatically adapt to the root size, the default is true
  },
  global: {                // custom configuration, will run through all canvas, group, node, edge, endpoint objects
    isScopeStrict: false   // whether scope is strict mode (default is false)
  }
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

### layout _`<Object>`_   (Optional)

&nbsp;&nbsp;canvas initialization automatically arranges the layout according to what you set, [reference](https://github.com/alibaba/butterfly/blob/master/docs/en-US/layout.md)

### theme

&nbsp;&nbsp;canvas theme configuration, default initialization style and interaction, mainly:

* edge &nbsp;&nbsp; connection configuration: Default style and interaction of all edges. The dragged edge will also use this configuration.

  *params*：

  * type _`<String>`_ whether the edge is connected to a node or to an endpoint. Default value `node`

  * shapeType _`<String>`_  edge type: Bezier, AdvancedBezier, Flow, Straight, Manhattan, Bezier2-1, Bezier2-2, Bezier2-3, BrokenLine; Default value `Straight`

  <img width="650" src="https://img.alicdn.com/imgextra/i3/O1CN01sHnesN1SMIhN62CLK_!!6000000002232-2-tps-1418-404.png">

  * label _`<String/Dom>`_ edge label

  * labelPosition _`<Number>`_ edge label position: the value is between 0-1, 0 represents the beginning of the egde, and 1 represents the end of the egde. Default value `0.5`

  * labelOffset _`<Number>`_ the position offset of edge label: the offset value from the label position of edge. The default value is 0, and the unit is `px`

  * isAllowLinkInSameNode _`<Boolean>`_ anchor connection restriction: whether to allow anchor connections in the same node

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

<img width="650" src="https://img.alicdn.com/tfs/TB16lUNBG61gK0jSZFlXXXDKFXa-1665-801.gif">
  
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

### canvas.autoLayout (type, options)

*descripition*：manually invoke automatic layout

*params*

* `{string} type` layout tyoe
* `{object} options` layout params

```js
autoLayout = (type, options) => {}
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

### canvas.addGroup ([object](./group.md#group-attr) | Group, nodes, options)

*descripition*：Add groups. If the group does not exist, create the group and add nodes into the group; If the group exists, nodes will be add into the current group.

*params*

* `{object | Group} object` Group: group information or group instance
* `{array< object | Node >} object` (Optional) Node information: these nodes will be added to the group. If the node does not exist, it will create these nodes
* `{object} options` params
* `{string} options.posType` 'absolute or relative' , Identifies whether the coordinates of the node are absolute positioning relative to the canvas or relative to the node group
* `{number} options.padding` group padding

```js
addGroup = (object|Group, nodes, options) => {}
```

This API can not only create new groups, but also select multiple nodes into groups:

<img width="650" src="https://img.alicdn.com/imgextra/i1/O1CN01S2n8Sy1aayJ8euH7n_!!6000000003347-1-tps-600-400.gif">

### canvas.removeGroup (string | Group)

*descripition* delete the group, but not delete the nodes inside

*params*

* `{string | Group} id` group id / Group instance

*return*

* `{Group}` delete Group instance

```js
removeGroup = (string | Group) => {}
```

### canvas.getNode (string)

*descripition*：get node by id

*params*

* `{string} id` node id

*return*

* `{Node}` Node instance

```js
getNode = (string) => {}
```

### canvas.addNode (object|Node)

*descripition*：add node

*params*

* `{object|Node} object` node infomation；Node － Node Basic Class

```js
addNode = ([object](./node.md#node-attr) | Node) => {}
```

### canvas.addNodes (array< [object](./node.md#node-attr) | Node >)

*descripition*：add multiple nodes

*params*

* `{array<object|Node>}` Node infomation；Node － Node Basic Class

```js
addNodes = (array<object|Node>) => {}
```

### canvas.removeNode (string)

*descripition*：delete node

*params*

* `nodeId string`  - node id

```js
removeNode = (string) => {}
```

### canvas.removeNodes (array)

*descripition*：delete multiple node

*params*

* `nodeIds array`  - multiple node id

```js
removeNodes = (array) => {}
```

### canvas.addEdge ( [object](./edge.md#edge-attr) | Edge )

*descripition*：add edge

*params*

* `{object|Edge} object`  - Edge infomation；Edge － Edge Basic Class

```js
addEdge = (object|Edge) => {}
```

### canvas.addEdges (array< [object](./edge.md#edge-attr) | Edge >)

*descripition*：add multiple edge

*params*

* `{array<object | Edge>}`   - Edge infomation；Edge － Edge Basic Class

```js
addEdges = (array<object|Edge>) => {}
```

### canvas.removeEdge (param)

*descripition*：delete edge by id or Edge instance

*params*

* `{string | Edge} id or Edge`  - edge id or Edge instance

*return*

* `{Edge}` - delete Edge instance

```js
removeEdge = (param) => {}
```

### canvas.removeEdges (param)

*descripition*：delete multiple edge by id or Edge instance

*params*

* `{array} string or Edge`  - edge id array or Edge instance array

*return*

* `{array} Edge` - delete Edge instance array

```js
removeEdges = (param) => {}
```

### canvas.getNeighborEdges (string)

*descripition*：get neighbor edges by node id

*params*

* `{string} nodeId`  - node id

*return*

* `{Edges}` - Edge instance array

```js
getNeighborEdges = (string) => {}
```

### canvas.getNeighborEdgesByEndpoint (string, string)

*descripition*：get neighbor edges by endpoint id

*params*

* `{string} nodeId`  - node id
* `{string} endpointId`  - endpoint id

*return*

* `{Edges}` - Edge instance array

```js
getNeighborEdgesByEndpoint = (string, string) => {}
```

### canvas.getNeighborNodesAndEdgesByLevel (options)

*descripition*：find N-level association nodes and edges

*params*

  * `{Object} options` - parameters
  * `{Node} options.node` - options.node - starting node
  * `{Endpoint} options.endpoint` - options.endpoint - starting endpoint(Optional)
  * `{String} options.type` - find direction , optional value all\in\out, default value `all` (Optional)
  * `{Number} options.level` - level，starting level is 0 level , default value `Infinity`
  * `{Function} options.iteratee` - whether to continue traversing the decision function, return boolean value

*return*

* `{Object<nodes: Node, edges: Edge>} filteredGraph` - filteredGraph - lookup result

```js
getNeighborNodesAndEdgesByLevel = (options) => {}
```

### canvas.setEdgeZIndex (edges, zIndex)

*descripition*：set edge z-index attribute

*params*

* `{Array<Edge>} edges` - edges array
* `{number} zIndex` - z-index

```js
setEdgeZIndex = (edges, zIndex) => {}
```

### canvas.setZoomable (boolean, boolean)

*descripition*：set whether the canvas can be zoomable

*params*

* `{true|false} boolean`  - whether the canvas can be zoomable
* `{true|false} boolean`  - the direction of zoom。Now it defaults to the two finger direction of MAC, but it is opposite to the mouse wheel direction of Window. Default value: false. If true, the direction is opposite

```js
setZoomable = (boolean, boolean) => {}}
```

### canvas.setMoveable (boolean)

*descripition*： set whether the canvas can be movable by dragging blank area

*params*

* `{true|false} boolean`  - whether the canvas can be movable
```js
setMoveable = (boolean) => {}
```

### canvas.move  (postion)

*descripition*：set canvas offset

*params*

* `{[x, y]} array`  - x,y

```js
move = (postion) => {}
```

### canvas.zoom (scale)

*descripition*：set canvas zoom value

*params*

* `{float} scale` - zoom value between 0-1
* `{function} callback`  - zoom callback

```js
zoom = (scale) => {}
```

### canvas.getZoom ()

*descripition*：get canvas zoom value

*return*

* `{float}` - zoom value between 0-1

```js
getZoom = () => {}
```

### canvas.getOffset ()

*descripition*：get canvas offset value which by dragging canvas

*return*

* `{[x, y]}` - offset value

```js
getOffset = () => {}
```

### canvas.getOrigin ()

*descripition*：get the center point of the canvas scaling, generally following the position of the mouse

*return*

* `{[x, y]}` - the center point of the canvas's zoom (percentage)

```js
getOrigin = () => {}
```

### canvas.setOrigin ([x ,y])

*descripition*：set the center point of the canvas zoom, generally follow the position of the mouse

*params*

* `{[x, y]} array` - the center point of the canvas's zoom (percentage)

```js
setOrigin = ([x ,y]) => {}
```

### canvas.focusNodeWithAnimate (string, type, options, callback)

*descripition*：focus on some node or group

*params*

* `{string} nodeId/groupId`  - node/group id
* `{string} type`  - type, `node` or `group`
* `{object} options {offset: [0,0]}`  - focus attribute , such as offset
* `{function} callback`  - finish callabck

```js
focusNodeWithAnimate = (string, type, options, callback) => {}
```

### canvas.focusNodesWithAnimate (objs, type, options, callback)

*descripition*：focus on multiple node/ group

*params*

* `{object} {nodes: [], groups: []}`  - node/group id array
* `{array} type`  - type, `node` or `group`
* `{object} options {offset: [0,0]}`  - focus attribute , such as offset
* `{function} callback`  - finish callabck

```js
focusNodesWithAnimate = (objs, type, options, callback) => {}
```

### canvas.focusCenterWithAnimate (options, callback)

*descripition*：focus on the entire canvas and automatically adjust the position and scale of the canvas

*params*

* `{object} options {offset: [0,0]}`  - focus attribute , such as offset
* `{function} callback`  - finish callabck

```js
focusCenterWithAnimate = (options, callback) => {}
```

<img width="650" src="https://img.alicdn.com/imgextra/i2/O1CN01zrkUqk1SP34Sup0vt_!!6000000002238-1-tps-1661-824.gif">

### canvas.redo ()

*descripition*：redo

```js
redo = () => {}
```

### canvas.undo ()

*descripition*：undo

```js
undo = () => {}
```

### canvas.pushActionQueue (options)

*descripition*：add the topmost element to the action queue (undo / redo queue)

*params*
* `{Object} options` - params
* `{String} options.type` - element type
* `{Object} options.data` - element data

```js
pushActionQueue = (options) => {}
```

### canvas.popActionQueue (options)

*descripition*：delete the topmost element from the action queue (undo / redo queue)

```js
popActionQueue = (options) => {}
```

### canvas.clearActionQueue (options)

*descripition*：delete all elements from the action queue (undo / redo queue)

```js
clearActionQueue = (options) => {}
```

### canvas.terminal2canvas (coordinates)

*descripition*：onvert the coordinates from screen to canvas

*params*

* `{array<number>} coordinates` - origin coordinates([x,y])

*return*

* `{number}` - converted coordinates

```js
terminal2canvas = (coordinates) => {}
```

### canvas.canvas2terminal (coordinates)

*descripition*：convert the coordinates from canvas to screen

*params*

* `{array<number>} coordinates` - origin coordinates([x,y])

*return*

* `{number}` - converted coordinates


```js
canvas2terminal = (coordinates) => {}
```

*descripition*

* As shown in the figure, the canvas is scaled, and the coordinates after the movement do not match the coordinates of the original canvas. This method is needed to convert. Special Note: Users who drag and drop nodes pay attention to these two `e.clientX` and `e.clientY`, and need to call this method to convert.

<img width="650" src="http://img.alicdn.com/tfs/TB1lWIAFHvpK1RjSZPiXXbmwXXa-973-850.jpg">


### canvas.setSelectMode (boolean, contents , selecMode)

*descripition*: set select mode: Note that select mode and normal drag canvas mode are mutually exclusive and cannot be set at the same time

*params*

* `{true|false} boolean`  - enable multiple select
* `{array} contents` - accept select contents(node/endpoint/edge, default `node`)
* `{string} selecMode` - accept selec mode(include|touch|senior),default 'include',include:You can select only if the element all included; touch: You can select only if you touch the element; senior: needs to include all from left to right,select only touch from right to left)

```js
setSelectMode = (boolean, contents , selecMode) => {}
```

### canvas.getUnion (name)

*descripition*：get union by name

*params*

* `{name} string`  - union name

```js
getUnion = (name) => {}
```

### canvas.getAllUnion ()

*descripition*：get all unions

```js
getAllUnion = () => {}
```

### canvas.add2Union (name, obj)

*descripition*：add some union or add union item , used in multiple selection mode

*params*

* `{name} string`  - union name.If not exist, add a new union; if it already exists, add item to union
* `{obj} object`  - union item

```js
add2Union = (name, obj) => {}

this.canvas.add2Union('my union', {
  nodes: []     // Node instance or nodeId
  groups: []    // Group instance or groupId
  edges: []     // Edge instance or edgeId
  endpoints: [] // Endpoint instance
});
```

### canvas.removeUnion (name)

*descripition*：remove union

*params*

* `{name} string`  - union name

```js
removeUnion = (name) => {}
```

### canvas.removeAllUnion ()

*descripition*：remove all union

```js
removeAllUnion = () => {}
```

<br>
<br>

## Events

```js
let canvas = new Canvas({...});
canvas.on('type key', (data) => {
  //data
});
```

*event key*

* `system.canvas.click` click on the blank space of the canvas event
* `system.canvas.zoom`	canvas zoom event
* `system.nodes.delete`	delete node event
* `system.node.move`	move node event
* `system.node.click`	click node event
* `system.nodes.add`	add multiple nodes event
* `system.links.delete`	delete edge event
* `system.link.connect`	connect edge event
* `system.link.reconnect`	edge reconnect event
* `system.link.click`	click edge event
* `system.group.add`	add group event
* `system.group.delete`	delete group event
* `system.group.move`	move group event
* `system.group.addMembers`	add node to group event
* `system.group.removeMembers`	delete node from group event
* `system.endpoint.limit`	connection exceeds the limitNum of Endpoint
* `system.multiple.select`	multiple select callback event
* `system.drag.start`	drag start event
* `system.drag.move`	drag move event
* `system.drag.end`	drag end event

```js
/**
  * emit events
  */
emit = (string, obj) => {}

/**
  * accept events
  */
on = (string, callback) => {}
```

<br>
<br>

## Other API

### canvas.setGridMode (show, options)

*descripition*：set the grid background

*params*

* `{true|false} boolean`  - whether to open
* `{array} options` - parameters for grid background

```js
setGridMode = (show, options) => {}

this.canvas.setGridMode(true, {
  isAdsorb: false,         // Whether to automatically adsorb, default value is false
  theme: {
    shapeType: 'line',     // show type，support line & circle
    gap: 23,               // grid gap
    adsorbGap: 8,          // adsorb gap
    background: '#fff',     // grid background
    lineColor: '#000',     // grid line color
    lineWidth: 1,          // grid line thickness
    circleRadiu: 1,        // grid circle radiu
    circleColor: '#000'    // grid circle color
  }
});
```

### canvas.justifyCoordinate ()

*descripition*：automatically align nodes / groups on the canvas(must be effective under the grid background)

```js
justifyCoordinate = () => {}
```

### canvas.setGuideLine (show, options)

*descripition*：set guide line

*params*

* `{true|false} boolean`  - whether to open
* `{array} options` - parameters for guide line

```js
setGuideLine = (show, options) => {}

this.canvas.setGuideLine(true, {
  limit: 1,             // limit guide line number
  adsorp: {
    enable: false       // enable auto adsorp
    gap: 5              // adsorp gap
  },
  theme: {
    lineColor: 'red',   // guide line color
    lineWidth: 1,       // guide line thickness
  }
});
```

<img width="600" src="https://img.alicdn.com/imgextra/i1/O1CN01bBhPsu1b3pH0VD1X9_!!6000000003410-1-tps-1274-600.gif">

### canvas.setMinimap = (show, options)

*descripition*：enable minimap

*params*

* `{true|false} boolean`  - whether to enable minimap
* `{Object}` please  refer to the minimap document for details

```js
setMinimap = (show, options) => {}
```

### canvas.save2img (options)

*descripition*：save canvas to iamge

*params*

* `{object} options` - saved image parameters (Optional)
* `{string} options.type` - image type (png/jpeg/svg , default png) , (Optional)
* `{number} options.quality` - image quality (0~1 , default 1) , (Optional)
* `{number} options.width` - image width (default canvas width) , (Optional)
* `{number} options.height` - image height (default canvas height) , (Optional)

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

### canvas.updateRootResize ()

*descripition*：need to update location when root canvas moves or size changes

```js
updateRootResize = () => {}
```