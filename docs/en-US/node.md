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

## attribute：<a name='node-attr'></a>

### id  _`<String>`_    (Require)
&nbsp;&nbsp;unique id
### top  _`<Number>`_    (Require)
&nbsp;&nbsp;y-axis coordinates: the coordinates of the node in the canvas. if it is in the group, it is relative to the internal coordinates of the group
### left _`<Number>`_   (Require)
&nbsp;&nbsp;x-axis coordinates: the coordinates of the node in the canvas. if it is in the group, it is relative to the internal coordinates of the group
### draggable _`<Boolean>`_   (Optional)
&nbsp;&nbsp;set whether the node can be dragged: can override the global draggable attribute
### group _`<String>`_    (Optional)
&nbsp;&nbsp;group id: after setting, the node will be added to the group
### endpoints _`<Array>`_    (Optional)
&nbsp;&nbsp;system endpoints configuration: system endpoints  will be added when this configuration is present
### Class _`<Class>`_    (Optional)
&nbsp;&nbsp;Extended class: when the extended class is passed in, the node will be rendered according to the draw method of the extended class, and the related methods of the extended class will also override the methods of the parent class
### scope _`<Boolean>`_    (Optional)
&nbsp;&nbsp;scope: only nodes with the same scope can be dragged into the group

```js
// single scope
node.scope = 'xxx';
// multiple scopes, can be connected in any one match
node.scope = 'xxx1 xxx2 xxx3';
```

**`The returned dom of the node must be set to position: absolute;`**

<br>
<br>

## Extented Class API：

```js
import {Node} from 'butterfly-dag';

Class YourNode extends Node {
  
  /**
    * callback after node mount
    */
  mounted() {}

  /**
    * node draw function
    * @param {obj} data - node data 
    * @return {dom} - node dom 
    */
  draw(obj) {}

}
```

<br>
<br>

## External Call API：

### node.getWidth ()

*description*： get group width

*return*

* `number`the width of the node

```js
getWidth = () => {}
```

### node.getHeight ()

*description*： get group height

*return*

* `number`the height of the node

```js
getHeight = () => {}
```

### node.setDraggable (boolean)

*description*： set whether the node is movable

*params*

* `boolean`set whether the node can be moved

```js
setDraggable = (boolean) => {}
```

### node.addEndpoint (obj)

*description*： add an endpoint point to the node。can add system endpoint or custom endpoint which is a sub dom in node. *Note: *This method must be executed after the node is mounted .

*params*

* `{obj} param` endpoint info (This method must be executed after the node is mounted )
* `{string} param.id` endpoint id
* `{string} param.orientation` endpoint direction (can control the direction of entry and exit of edges)
* `{string} param.scope` connection scope
* `{string} param.type` 'source' / 'target' / undefined / 'onlyConnect'，please check endpoint document.
* `{string} param.dom`any sub DOM in the node can be used as a custom endpoint

```js
addEndpoint = (obj) => {}
```

### node.removeEndpoint(string)

*description*：remove an endpoint point from the node

*params*

* `{string} pointId`endpoint id(This method must be executed after the node is mounted)

*return*

* ` {Endpoint}`Endpoint instance

```js
removeEndpoint = (string) => {}
```

### node.getEndpoint (id, type)

*description*：get an endpoint point from the node

*params*

* `{string(Require)} pointId`endpoint id
* `{string(Optional)} type`endpoint type . If the type is passed, both id and type of endpoint are exactly the same to match

*return*

* `{Endpoint}`Endpoint instance

```
getEndpoint = (id, type) => {}
```

### node.moveTo (x, y)

*description*： the method of node moving coordinates

*params*

* `{number} x `x coordinate
* `{number} y `y coordinate

```js
moveTo = (x, y) => {}
```

### node.remove ()

*description*： the method of node deletion. Consistent with the method `canvas.removeNode`

```js
remove = () => {}
```

### node.emit (event, data)

*description*： emit events, canvas or any elements can receive event from the node 

*params*

* `{string} event `emit event name
* `{number} data `emit event data

```js
emit = (string, obj) => {}
```

### node.on (string, callback)

*description*： receive events, the node can receive events from canvas or any elements

*params*

* `{string} event `receive event name
* `{function} data `receive event callback

```js
on = (string, callback) => {}
```

### [Tree Layout]treeNode.collapseNode (string)

*description*： the method of node shrinkage

*params*

* `{string} nodeId`node id

```js
collapseNode = (string) => {}
```

### [Tree Layout]treeNode.expandNode (string)

*description*： the method of node expansion

*params*

* `{string} nodeId`node id

```js
expandNode = (string) => {}
```
