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

**`The returned dom of the group must be set to position: absolute;`**

<br>
<br>

## attribute <a name='group-attr'></a>

### id _`<String>`_ (Require)
&nbsp;&nbsp;unique id of node
### top _`<Number>`_ (Require)
&nbsp;&nbsp;y coordinate
### left _`<Number>`_ (Require)
&nbsp;&nbsp;x coordinate
### width _`<Number>`_ (Optional)
&nbsp;&nbsp;group width
### height _`<Number>`_ (Optional)
&nbsp;&nbsp;group height
### endpoints _`<Array>`_ (Optional)
&nbsp;&nbsp;system endpoints configuration: system endpoints  will be added when this configuration is present
### Class _`<Class>`_ (Optional)
&nbsp;&nbsp;extended class: when the extended class is passed in, the group will be rendered according to the draw method of the extended class, and the related methods of the extended class will also override the methods of the parent class
### scope _`<String>`_ (Optional)
&nbsp;&nbsp;scope: When the scope of the node is the same as the scope of the group, it can be added to the group. You can join as you like without setting it by default

```js
// single scope
group.scope = 'xxx';
// multiple scope, any one matched can be connected
group.scope = 'xxx1 xxx2 xxx3';
```

### draggable _`<Boolean>`_ (Optional)
&nbsp;&nbsp;the group is draggable. the default value is true
### resize _`<Boolean>`_ (Optional)
&nbsp;&nbsp;the size of the group is resizable.  the default value is true

<img width="400" src="https://img.alicdn.com/imgextra/i4/O1CN01nb2APF1ZM1lbFNKM1_!!6000000003179-1-tps-400-300.gif">

### group _`<String>`_ (Optional)
&nbsp;&nbsp;the id of the parent group: For supporting group nesting, you need to set 'canvas.theme.group.includeGroups' open
  
<img width="400" src="https://img.alicdn.com/imgextra/i4/O1CN01qmOWWj1CKtcvZZJ7Q_!!6000000000063-2-tps-842-536.png">

<br>
<br>

## Extented Class API：

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

*description*： get group width

*return*

* `number` the width of the group

```js
getWidth = () => {}
```

### group.getHeight ()

*description*： get group height

*return*

* `number` the height of the group

```js
getHeight = () => {}
```

### group.setSize(width, height)

*description*： set size of the group

*param*

* `{number} width`the width of the group

* `{number} height`the height of the group

```js
setSize = (width, height) => {}
```

### group.addNode (node)

*description*：  add node to the group

*param*

* `{obj} node` node data

```js
addNode = (node) => {}
```

### group.addNodes (nodes)

*description*： add multiple nodes to the group

*param*

* `{array} nodes`nodes array

```js
addNodes = (nodes) => {}
```

### group.removeNode (node)

*description*： delete node from the group

*param*

* `{obj} node`node data

```js
removeNode = (node) => {}
```

### group.removeNodes (nodes)

*description*： delete  nodes from the group

*param*

* `{obj} nodes`nodes array

```js
removeNodes = (nodes) => {}
```

### group.addEndpoint (obj)

*description*： add endpoint to the group

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

*description*： get endpoint by id

*param*

* `{string} pointId` endpoint id 

*return*

* `{Endpoint}`Endpoint Object

```js
getEndpoint = (id) => {}
```

### group.moveTo (obj)

*description*： move coordinates of the group

*params*

* `{number} obj.x `move to x coordinate
* `{number} obj.y `move to y coordinate

```js
moveTo = (obj) => {}
```

### group.emit (event, data)

*description*： emit events, canvas or any elements can receive event from the group 

*params*

* `{string} event `emit event name
* `{number} data `emit event data

```js
emit = (string, obj) => {}
```

### group.on (string, callback)

*description*： receive events, the group can receive events from canvas or any elements

*params*

* `{string} event `receive event name
* `{function} data `receive event callback

```js
on = (string, callback) => {}
```

