# Group

## Usage

```
const Group = require('butterfly-dag').Group;
class AGroup extends Group {
  draw(obj) {
    // here you can custom dom according to your needs.
  }
}

canvas.draw({
  groups: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: AGroup // after setting the base class, the canvas will render based on the custom class.
  }],
  nodes: ...
  edges: ...
})
```

## Property

| key | describe | type | default 
| :------ | :------ | :------ | :------ 
| id | unique id | string (Require) | - 
| top | y coordinate | number (Require) | - 
| left | x coordinate | number (Require) | - 
| width | group width | number (Option) | - 
| height | group height | number (Option) | - 
| endpoints | endpoint data | array (Option) | - 
| Class | extended class | Class (Option) | When the extended class is passed in, the node group will be rendered according to the draw method of the extended class, and the related methods of the extended class will also override the method of the parent class.
| scope | scope | boolean (Option) | When the scope of the node is consistent with the scope of the group, it can be added to the group. You can join as you like without setting it by default.

`* The returned dom of the node must be set to position: absolute;`

## API

```
/**
  * group draw function
  * @param {obj} data - group data
  * @return {dom} - group dom
  */
draw = (obj) => {}

/**
  * callback after group mount
  */
mounted = () => {}

/**
  * add node to group
  * @param {obj} node - node data
  */
addNode = (node) => {}

/**
  * add multiple nodes to group
  * @param {array} nodes - nodes array
  */
addNodes = (nodes) => {}

/**
  * delete node from group
  * @param {obj} node - node data
  */
removeNode = (node) => {}

/**
  * group删除节点
  * @param {array} nodes - 节点数组
  */
removeNodes = (nodes) => {}

/**
  * @param {obj} data - endpoint data (this method must be executed after the node is mounted)
  */
addEndpoint = (obj) => {}

/**
  * @param {string} pointId - endpoint id
  * @return {Endpoint} - Endpoint object
  */
getEndpoint = (id) => {}

/**
  * @return {number} - get group width
  */
getWidth = () => {}

/**
  * @return {number} - get group height
  */
getHeight = () => {}

/**
  * emit events
  */
emit = (string, obj) => {}

/**
  * accept events
  */
on = (string, callback) => {}
```

## Detail