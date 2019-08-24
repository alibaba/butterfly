# Endpoint

## Usage
```
// Usage One:
canvas.draw({
  nodes: [{
    ...
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }]
})

// Usage Two:
let node = this.canvas.getNode('xxx');
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom           // with this property the user can use any dom as an endpoint
});
```

## Property
| key | describe | type | default 
| :------ | :------ | :------ | :------ 
| id | unique id | string (Require) | - 
| orientation | direction | array (Optional) | Bottom:[0,1]/Top:[0,-1]/Right:[1,0]/Left:[-1,0]
| pos | position | array (Optional) | - 
| scope | scope | string (Optional) | endpoint scope is the same to connect
| type | source endpoint or target endpoint | string (Optional) | 'source' / 'target' / undefined，when undefined, the anchor is both source and target.
| disLinkable | enable break edge from this endpoint | boolean (Optional) | This attribute is limited to target endpoint
| root | endpoint can be attached to a child element | string (Optional) | - 
| Class | extended class | Class (Optional) | When the extended class is passed in, the node group will be rendered according to the draw method of the extended class, and the related methods of the extended class will also override the method of the parent class.
| dom | custom dom (any dom on root node) | dom (Optional) | - 
| expendArea | set the hot zone of the endpoint connection to override the settings in the theme | Object (Optional) | {left:10, right:10, top:10, bottom:10}

## 方法
```
/**
  * @return {dom} - custom endpoint dom
  */
draw = () => {}

/**
  * callback after endpoint mount
  */
mounted = () => {}

/**
  * callback after endpoint updated
  */
updated = () => {}

/**
  * @param {number} x - the x coordinate of the moving position
  * @param {number} y - the y coordinate of the moving position
  */
moveTo = (obj) => {}

/**
  * set the state of linkable when connecting (need to set the this.theme.endpoint.linkableHighlight property)
  */
linkable = () => {}

/**
  * set linkable state when disconnected
  */
unLinkable = () => {}

/**
  * set linkable and hover state when connecting (requires setting this.theme.endpoint.linkableHighlight property)
  */
hoverLinkable = () => {}

/**
  * set linkable and hover state when disconnected
  */
unHoverLinkable = () => {}

```

