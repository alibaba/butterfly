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

## attribute<a name='edge-attr'></a>：

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

## API：

### <a name='edge-custom-dom'>custom edge</a>：
```js
/**
  * @return {dom} - custom node dom
  */
draw = () => {}

/**
  * @param {obj} sourcePoint(Optional) - source node coordinates and direction
  * @param {obj} targetPoint(Optional) - target node coordinates and direction
  * @return {string} - path
  */
calcPath = () => {}

/**
  * callback after the edge is mounted
  */
mounted = () => {}

/**
  * callback after line updated
  */
updated = () => {}
```

### <a name='edge-custom-arrow'>custom arrow</a>：

```js
/**
  * @return {dom} - custom arrow dom
  */
drawArrow = () => {}
```

### <a name='edge-custom-label'>custom label</a>：
```js
/**
  * @return {dom} - 自定义label的dom
  */
drawLabel = () => {}
```

### <a name='edge-isConnect'>edge connectivity</a>：

```js
/**
  * @return {boolean} - complicated connection conditions can be customized
  */
isConnect = () => {}

```

### <a name='edge-event'>event</a>：

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

### <a name='edge-animation'>animatio</a>：

```js
/**
  * add edge animation
  * @param {obj} options(Optional) - animation configure
  * @param {number} options.radius (Optional) - animation node radius
  * @param {string} options.color (Optional) - animation node color
  * @param {string} options.dur (Optional) - animation run time，for example：1s
  * @param {number|string} options.repeatCount (Optional) - number of animation repetitions，for example：1 or 'indefinite'
  */
addAnimate = (options) => {}
```

<img width="600" src="https://img.alicdn.com/tfs/TB1anoGvkL0gK0jSZFAXXcA9pXa-921-532.gif">
Besides, 1000 nodes + 1000 edges, the animation runs perfectly
<img width="600" src="https://img.alicdn.com/tfs/TB1N4a_wi_1gK0jSZFqXXcpaXXa-662-466.gif">