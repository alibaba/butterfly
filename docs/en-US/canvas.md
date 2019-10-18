# Canvas

```
let canvas = new Canvas({
  root: dom,               // canvas root dom (require)
  layout: 'ForceLayout'    // layout setting , integrated or custom , (optional)
  zoomable: true,          // enable zoom canvas (optional)
  moveable: true,          // enable move canvas (optional)
  draggable: true,         // enable drag nodes (optional)
  linkable: true,          // enable connect edges (optional)
  disLinkable: true,       // enable disConnect edges (optional)
  theme: {                 // theme (optional) 
    edge: {
      type: 'Bezier',      // edge type：Bezier curve，Polyline ，Straight，Manhattan line，Improved Bezier curve。values ： Bezier/Flow/Straight/Manhattan/AdvancedBezier
      label: 'test',       // edge label
      arrow: true,         // whether to show arrow
      arrowPosition: 0.5,  // arrow position (0 ~ 1)
      arrowOffset: 0.0,    // arrow offset
      Class: XXClass,      // custom Class
      isExpandWidth: false //  expand line interaction area
    },
    endpoint: {
      position: []         // limit endpoint position ['Top', 'Bottom', 'Left', 'Right'],
      linkableHighlight: true // point.linkable method is triggered when connecting, can be highlighted
      expendArea: {        // when the anchor point is too small, the connection hot zone can be expanded.
        left: 10,
        right: 10,
        top: 10,
        botton: 10
      }
    },
    zoomGap: 0.001         // mouse zoom in and out gap settings
  },
  global: {                // custom configuration, will run through all canvas, group, node, edge, endpoint objects
    isScopeStrict: false   // whether scope is strict mode (default is false)
  }
});
```

## Property

| key | describe | type | default 
| :------ | :------ | :------ | :------ 
| root | canvas root dom | Dom (Require) | `*this dom must set 'position:relative'`
| <a href='#layout'>layout</a> | auto layout | string/function (optional) | null 
| zoomable | enable zoom canvas | boolean (optional) | false 
| moveable | enable move canvas | boolean (optional) | false 
| draggable | enable drag nodes | boolean (optional) | false 
| linkable | enable connect edges | boolean (optional) | false 
| disLinkable | enable disConnect edges | boolean (optional) | false 
| theme | canvas theme setting | object (optional) | undefined
| <a href="#global">global</a> | global attribute | object (optional) | undefined


### API：
```
/**
  * draw function
  * @param {data} data  - include groups, nodes, edges
  * @param {function} callback  - `*the rendering process is an asynchronous process, please pay attention to the callback.`
  */
draw = (data, calllback) => {}

/**
  * add group function
  * @param {object|Group} object  - group data or Group instance
  */
addGroup = (object|Group) => {}

/**
  * get node by id
  * @param {string} id  - node id
  * @return {Node} - Node Object
  */
getNode = (string) => {}

/**
  * get group by id
  * @param {string} id  - group id
  * @return {Group} - Group Object
  */
getGroup = (string) => {}

/**
  * get neighbor edges by node id 
  * @param {string} id  - node id
  * @return {Edges} - neighbor Edges Object
  */
getNeighborEdges = (string) => {}

/**
  * add node function
  * @param {object|Node} object  - node data or Node instance
  */
addNode = (object|Node) => {}

/**
  * add edge function
  * @param {object|Edge} object  - edge data or Edge instance
  */
addEdge = (object|Edge) => {}

/**
  * delete node by id
  * @param nodeId string  - node id
  */
removeNode = (string) => {}

/**
  * delete multiple nodes by ids
  * @param nodeIds array  - node ids array
  */
removeNodes = (array) => {}

/**
  * delete group by id
  * @param {string} id  - node id
  * @return {Group} - Group Obejct
  */
removeGroup = (string) => {}

/**
  * delete Edge by id or Edge Object
  * @param {string or Edge} id or Edge  - Edge id or Edge Object
  * @return {Edge} - Edge Object
  */
removeEdge = (param) => {}

/**
  * delete multiple Edges by ids or Edge Objects
  * @param {array} string or Edge  - Edge ids array or Edge Objects array
  * @return {array} Edge - Edge array
  */
removeEdges = (param) => {}

/**
  * set canvas zoomable
  * @param {true|false} boolean 
  */
setZoomable = (boolean) => {}

/**
  * set canvas moveable
  * @param {true|false} boolean
  */
setMoveable = (boolean) => {}

/**
  * focus on some node/ group
  * @param {string/function} nodeId/groupId or filter  - node/group id or filter
  * @param {string} type  - type (node or group)
  * @param {object} options {offset: [0,0]}  - focus attribute , such as offset
  * @param {function} callback  - Focused callback
  */
focusNodeWithAnimate = (string, type, options, callback) => {}

/**
  * focus on multiple node/ group
  * @param {object} {nodes: [], groups: []}  - node and group ids array
  * @param {array} type  - type array (node or group)
  * @param {object} options {offset: [0,0]}  - focus attribute , such as offset
  * @param {function} callback  - Focused callback
  */
focusNodesWithAnimate = (objs, type, options, callback) => {}

/**
  * centered canvas, show all nodes and groups in canvas, it will automatically adjust the canvas position and zoom
  * @param {object} options {offset: [0,0]}  - focus attribute , such as offset
  * @param {function} callback  - Focused callback
  */
focusCenterWithAnimate = (options, callback) => {}

/**
  * set select mode
  * @param {true|false} boolean
  * @param {array} type - accept select type(node/endpoint/edge, default node)
  */
setSelectMode = (boolean, type) => {}

/**
  * get canvas zoom value
  * @return {float} - zoom value (0-1)
  */
getZoom = () => {}

/**
  * get canvas offset value
  * @return {[x, y]} - offset value
  */
getOffset = () => {}

/**
  * get canvas origin reference point
  * @return {[x, y]} - canvas origin reference point (percentage)
  */
getOrigin = () => {}

/**
  * get all data from canvas
  * @return {data} - canvas data
  */
getDataMap = () => {}

/**
  * set canvas origin reference point
  * @param {[x, y]} array  - canvas origin reference point (percentage)
  */
setOrigin = ([x ,y]) => {}

/**
  * set canvas offset
  * @param {[x, y]} array
  */
move = (postion) => {}

/**
  * set canvas zoom
  * @param {scale} float  - zoom value between 0-1
  * @param {function} callback  - zoom callback
  */
zoom = (postion) => {}

/**
  * get union by name
  * @param {name} string  - union name
  */
getUnion = (name) => {}

/**
  * get all unions
  */
getAllUnion = () => {}

/**
  * add some union or add union item , used in multiple selection mode
  * @param {name} string  - union name
  * @param {obj} object  - union item
  */
add2Union = (name, obj) => {}

/**
  * remove union by name
  * @param {name} string  - union name
  */
removeUnion = (name) => {}

/**
  * remove all union
  */
removeAllUnion = () => {}

/**
  * emit events
  */
emit = (string, obj) => {}

/**
  * accept events
  */
on = (string, callback) => {}

/**
  * set the grid layout
  * @param {true|false} boolean  - whether to open
  * @param {array} options - parameters for grid layout
  */
setGirdMode = (show, options) => {}

/**
  * automatically align nodes / groups on the canvas(must be effective under the grid layout)
  */
justifyCoordinate = () => {}


/**
  * set guide line
  * @param {true|false} boolean  - whether to open
  * @param {array} options - parameters for guide line
  */
setGuideLine = (show, options) => {}

/**
  * set minimap
  * @param {true|false} boolean  - whether to open
  * @param {Object} please  refer to the minimap section for details
  /
setMinimap = (show, options) => {}

/**
  * convert the coordinates from screen to canvas
  * @param {array[number]} coordinates - origin coordinates([x,y])
  * @return {number} - converted coordinates
  */
terminal2canvas = (coordinates) => {}

/**
  * convert the coordinates from canvas to screen
  * @param {array[number]} coordinates - origin coordinates([x,y])
  * @return {number} - converted coordinates
  */
canvas2terminal = (coordinates) => {}

/**
  * save canvas to iamge
  * @param {object=} options - saved image parameters
  * @param {string=} options.type - image type (png/jpeg/svg , default png) , optional
  * @param {number=} options.quality - image quality (0~1 , default 1) , optional
  * @param {number=} options.width - image width (default canvas width) , optional
  * @param {number=} options.height - image height (default canvas height) , optional
  * @return {Promise}
  */
save2img = (options) => {}

/**
  * need to update location when root canvas moves or size changes
  */
updateRootResize = () => {}

/**
  * find N-level association nodes and edges
  * @param {Object} options - parameters
  * @param {Node} options.node - starting node
  * @param {Endpoint} options.endpoint - starting endpoint, optional
  * @param {String} options.type - find direction , optional value all\in\out，default value all , optional
  * @param {Number} options.level - level，starting level is 0 level , default value Infinity
  * @param {Function} options.iteratee - whether to continue traversing the decision function, return boolean value
  * @returns {Object<nodes: Node, edges: Edge>} filteredGraph - lookup result
  */
getNeighborNodesAndEdgesByLevel = (options) => {}

```


## Event

```
let canvas = new Canvas({...});
canvas.on('type', (data) => {
  //data 
});
```

| key | describe | return 
| :------ | :------ | :------
| system.canvas.click | click on the blank space of the canvas event | -
| system.canvas.zoom | canvas zoom event | -
| system.node.delete | delete node event | -
| system.node.move | move node event | -
| system.nodes.add | add multiple nodes event | -
| system.link.delete | delete edge event | -
| system.link.connect | connect edge event | -
| system.link.reconnect | edge reconnect event | -
| system.link.click | click edge event | -
| system.group.delete | delete group event | -
| system.group.move | move group event | -
| system.group.addMembers | add node to group event | -
| system.group.removeMembers | delete node from group event | -
| system.multiple.select | multiple select callback event | -
| system.drag.start | drag start event | -
| system.drag.move | drag move event | -
| system.drag.end | drag end event | -


## Detail

### Property description

#### <a name='global'>global</a>
* **isScopeStrict**，used to set the global scope strict mode
  * The default is false. If the value is set to true, the scope must match when the scope must be identical; if the value is false, all values are matched when the scope is undefined.

#### <a name='layout'>layout</a>
* **重力布局**，pass `'ForceLayout'`，butterfly built-in layout
* **自定义布局**，pass in a method, which can be layout according to user needs. Note:`In addition, remember to overwrite the Edge calcPath method, otherwise it will be replaced by butterfly's built-in calculation edge  method, and the resulting edge cannot be realized.`

```
let canvas = new Canvas({
  layout: (opts) => {
    // canvas width and height
    let width = opts.width;
    let height = opts. height;
    // nodes, groups, and edges data to be rendered
    let data = opts.data;
    // assign the left and top values of nodes and groups
    ......
  }
})
```

### Function description

* **setGirdMode**, Set the grid layout
  * `show`，whether to open
  * `options`，set the parameters of the grid layout ,  please look at the following comment

```
this.canvas.setGirdMode(true, {
  isAdsorb: false,         // Whether to automatically adsorb, default value is false
  theme: {
    shapeType: 'line',     // show type，support line & circle
    gap: 23,               // grid gap
    adsorbGap: 8,          // adsorb gap
    backgroud: '#fff',     // grid backgroud
    lineColor: '#000',     // grid line color
    lineWidth: 1,          // grid line thickness
    circleRadiu: 1,        // grid circle radiu
    circleColor: '#000'    // grid circle color
  }
});
```

* **setGuideLine**, Set the guide line
  * `show`, whether to open
  * `options`, the parameters of the guide line, please lookup the following comment

```
this.canvas.setGuideLine(true, {
  limit: 1,             // limit guide line number
  theme: {
    lineColor: 'red',   // guide line color
    lineWidth: 1,       // guide line thickness
  }
});
```

* **add2Union**
  * `name`，union name。add union if it does not exist , add union item if it exists.
  * `object`，union item

```
this.canvas.add2Union('my union name', {
  nodes: []     // Node object or nodeId
  groups: []    // Group object or groupId
  edges: []     // Edge object or edgeId
  endpoints: [] // Endpoint object
});
```

* **canvas2terminal**，convert the coordinates from canvas to screen
  * As shown in the figure, the canvas is scaled, and the coordinates after the movement do not match the coordinates of the original canvas. This method is needed to convert. Special Note: Users who drag and drop nodes pay attention to these two `e.clientX` and `e.clientY`, and need to call this method to convert.
<img width="400" src="http://img.alicdn.com/tfs/TB1lWIAFHvpK1RjSZPiXXbmwXXa-973-850.jpg">

* **terminal2canvas**，convert the coordinates from screen to canvas
  * `canvas2terminal` in contrast
 
* **save2img**，save canvas to image
  * `options`，parameter
  * `options.type`，image type 
  * `options.quality`，image quality
  * `options.width`，image width
  * `options.height`，image height

```
this.canvas.save2img({type: 'png', width: 1920, height: 1080, quality: 1})
  .then(dataUrl => {
    var link = document.createElement('a');
    link.download = 'XXX.png';
    link.href = dataUrl;
    link.click();
  });
```