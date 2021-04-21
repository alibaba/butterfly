# Group

## Usage

```js
const Group = require('butterfly-dag').Group;
class AGroup extends Group {
  draw(obj) {
    // here you can custom dom according to your needs.
  }
}

// Initialize draw
canvas.draw({
  groups: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: AGroup // after setting the base class, the canvas will render based on the custom class.
    ...
    //the attribute below
  }],
  nodes: ...
  edges: ...
})

// Dynamic addition
canvas.addGroup({
  ...
  // the attribute below
});
```
<br>

**`The returned dom of the node must be set to position: absolute;`**

<br>
<br>

## attribute

### id _`<String>`_ （Require）
&nbsp;&nbsp;unique id of node
### top _`<Number>`_ （Require）
&nbsp;&nbsp;y coordinate
### left _`<Number>`_ （Require）
&nbsp;&nbsp;x coordinate
### width _`<Number>`_ (Option)
&nbsp;&nbsp;group width
### height _`<Number>`_ (Option)
&nbsp;&nbsp;group height
### endpoints _`<Array>`_ (Option)
&nbsp;&nbsp;system endpoints configuration: system endpoints  will be added when this configuration is present
### Class _`<Class>`_ (Option)
&nbsp;&nbsp;extended class
### scope _`<String>`_ (Option)
&nbsp;&nbsp;scope: When the scope of the node is consistent with the scope of the group, it can be added to the group. You can join as you like without setting it by default

```js
// single scope
group.scope = 'xxx';
// multiple scope, any one matched can be connected
group.scope = 'xxx1 xxx2 xxx3';
```

### draggable _`<Boolean>`_ (Option)
&nbsp;&nbsp;the node group is draggable. the default value is true
### resize _`<Boolean>`_ (Option)
&nbsp;&nbsp;the size of the node group is resizable.  the default value is true

<img width="400" src="https://img.alicdn.com/imgextra/i4/O1CN01nb2APF1ZM1lbFNKM1_!!6000000003179-1-tps-400-300.gif">

### group _`<String>`_ (Option)
&nbsp;&nbsp;the id of the parent group: For supporting group nesting, you need to set canvas.theme.group.includeGroups open
  
<img width="400" src="https://img.alicdn.com/imgextra/i4/O1CN01qmOWWj1CKtcvZZJ7Q_!!6000000000063-2-tps-842-536.png">

<br>
<br>

## Class extend API：

```js
import {Group} from 'butterfly-dag';

Class YourGroup extends Group {
  
  /**
    * callback after group mount
    */
  mount() {}

  /**
    * group draw function
    * @param {obj} data - group data 
    * @return {dom} - group dom
    */
  draw(obj) {}
}
```

<br>
<br>

## External Call API：

### group.getWidth()

*function*： get group width

*return*

* `number` the width of group

```js
getWidth = () => {}
```

### group.getHeight ()

*function*： get group height

*return*

* `number` the height of group

```js
getHeight = () => {}
```

### group.addNode (node)

*function*：  add node to group

*param*

* `{obj} node` node data

```js
addNode = (node) => {}
```

### group.addNodes (nodes)

*function*： add multiple nodes to group

*param*

* `{array} nodes`nodes array

```js
addNodes = (nodes) => {}
```

### group.removeNode (node)

*function*： delete node from group

*param*

* `{obj} node`node data

```js
removeNode = (node) => {}
```

### group.removeNodes (nodes)

*function*： delete  nodes from group

*param*

* `{obj} nodes`nodes array

```js
removeNodes = (nodes) => {}
```

### group.addEndpoint (obj)

*function*： add endpoint to group

*params*

* `{obj} param` endpoint data (this method must be executed after the node is mounted)
* `{string} param.id` endpoint id
* `{string} param.orientation` endpoint direction (it can control the direction of the edge linkin or linkout)
* `{string} param.scope` scope
* `{string} param.type` 'source' / 'target' / undefined，ednpoint is both source and target when undefined
* `{string} param.dom` any sub DOM in the node can be used as a custom endpoint

```js
addEndpoint = (obj) => {}
```

### group.getEndpoint (id)

*function*： get endpoint by id

*param*

* `{string} pointId` endpoint id 

*return*

* `{Endpoint}`Endpoint Object

```js
getEndpoint = (id) => {}
```

### group.moveTo (obj)

*function*： move coordinates of the node group

*params*

* `{number} obj.x `move to x coordinate
* `{number} obj.y `move to y coordinate

```js
moveTo = (obj) => {}
```

### group.emit (event, data)

*function*： emit events,canvas or any elements can receive event from the node group 

*params*

* `{string} event `emit event name
* `{number} data `emit event data

```js
emit = (string, obj) => {}
```

### group.on (string, callback)

*function*： accept events, the group can accept events from canvas or any elements

*params*

* `{string} event ` accept event name
* `{function} data `accept event callback

```js
on = (string, callback) => {}
```

