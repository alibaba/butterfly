# Edge

## Usage
```
canvas.draw({
  edges: [{
    source: 'point_1',
    target: 'point_2',
    sourceNode: 'node_1',
    targetNode: 'node_2',
    type: 'endpoint',
    arrow: ture,
    arrowPosition: 0.5,
    arrowOffset: 0,  // final position of the arrow：lineLength * arrowPosition + arrowOffset
    label: 'I am label'   //Here you can also pass dom, of course, you can also extend the parent class's drawLabel to customize the label.
  }],
  groups: ...
  nodes: ...
})
```

## Property
| key | describe | type | default 
| :------ | :------ | :------ | :------ 
| id | unique id | string (Require) | - 
| targetNode | target node id | string (Require) | - 
| target | target endpoint id | string (Require) | - 
| sourceNode | source node id | string (Require) | - 
| source | source endpoint id | string (Require) | - 
| type | whether the marker line is connected to node or connected to endpoint | string (Optional) | endpoint/node
| orientationLimit | edge leave position | array (Optional) | - 
| shapeType | edge type | string (Optional) | Bezier/Flow/Straight
| label | edge label| string/dom (Optional) | -
| arrow | edge arrow | boolean (Optional) | 默认false
| Class | extended Class | Class (Optional) | `Generally, the need has been met, because the logic is more complicated, it is not recommended to expand the base class of the line. `When the extension class is passed in, the node group will be rendered according to the draw method of the extension class. The related methods of the extension class will also override the method of the parent class.
| arrowPosition | arrow position on the edge | float (Optional) | between 0-1, default 0.5
| arrowOffset | the offset of the arrow relative to the arrowPosition | float (Optional) | default 0, unit: pixel

`* Set isExpandWidth to true to get eventHandlerDom for mounting events.`

## API

```
/**
  * @return {dom} - custom node dom
  */
draw = () => {}

/**
  * callback after the edge is mounted
  */
mounted = () => {}

/**
  * @return {boolean} - complicated connection conditions can be customized
  */
isConnect = () => {}

/**
  * callback after line updated
  */
updated = () => {}

/**
  * @return {dom} - custom label dom
  */
drawLabel = () => {}

/**
  * @return {dom} - custom arrow dom
  */
drawArrow = () => {}

/**
  * @param {obj} sourcePoint(Optional) - source node coordinates and direction
  * @param {obj} targetPoint(Optional) - target node coordinates and direction
  * @return {string} - path
  */
calcPath = () => {}

/**
  * emit events
  */
emit = (string, obj) => {}

/**
  * accept events
  */
on = (string, callback) => {}
```
