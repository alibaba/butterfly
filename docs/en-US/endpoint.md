# Endpoint

## Usage
```js
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

// Usage Two: This method must be used after the node is mounted
let node = this.canvas.getNode('xxx');
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom           // with this property the user can use any dom as an endpoint
});
```

<br>
<br>

## attribute：

### id  _`<String>`_ (Require)

&nbsp;&nbsp;unique id


### orientation _`<Array>`_（Optional）

&nbsp;&nbsp;direction: (1) controll the direction of the system anchor point (2) control the direction of the entrance and exit of the line segment

* Bottom: [0,1]
* Top: [0,-1]
* Right: [1,0]
* Left: [-1,0]

<img width="650" src="https://img.alicdn.com/imgextra/i2/O1CN01UcRB7j1nQWGvFm1jM_!!6000000005084-0-tps-800-460.jpg">

### pos _`<Array>`_ (Optional)

&nbsp;&nbsp;position:The position of the anchor point of the control system. Can be used with orientation to control the anchor point of the system

&nbsp;&nbsp;Value: [between 0-1, between 0-1], 0 represents the leftmost/upper side, 1 represents the rightmost/lower side

<img width="650" src="https://img.alicdn.com/imgextra/i3/O1CN012Z29af27tdlsRTaiC_!!6000000007855-0-tps-800-460.jpg">

### type _`<String>`_ (Optional)

&nbsp;&nbsp;Anchor type: 

* source: Source anchor. Line segments can only go in and out
* target: Target anchor point. Line segment only goes in and cannot go out
* undefined: No anchor point defined. The line segment can be in and out, but it depends on whether the first line is in or out
* onlyConnect: The anchor point of the broken line cannot be dragged. Line segments can enter and exit, but drag to break the line


### scope _`<String>`_ (Optional)

&nbsp;&nbsp;scope: Only when the anchor points have the same scope can be connected.

```js
// single scope
endpoint.scope = 'xxx';
// Multiple scopes, can be connected in any match
endpoint.scope = 'xxx1 xxx2 xxx3';
```

### disLinkable _`<Boolean >`_ (Optional)

&nbsp;&nbsp;Disallow anchor dragging to break the line segment


### expandArea _`<Object>`_ (Optional)

&nbsp;&nbsp;Hot zone connected by anchor point: Since the anchor point area may be too small, it provides the property of expanding the hot zone. In addition, this attribute can override the theme attribute in the canvas.

```js
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  expandArea: {
    left: 10,
    right: 10,
    top: 10,
    botton: 10
  }
  ...
});
```

<img width="650" src="https://img.alicdn.com/imgextra/i1/O1CN01x8cvVc1oQo8daQTji_!!6000000005220-1-tps-600-400.gif">

### limitNum _`<Number>`_ (Optional)

&nbsp;&nbsp;Limit on the number of connections


### connectedNum _`<Number>`_ (Optional)

&nbsp;&nbsp;Number of connected line segments


### dom _`<Dom>`_ (Optional)

&nbsp;&nbsp;Custom anchor point dom: If this parameter is passed in, this dom will become the anchor point

```js
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom,
  ...
});
```


### Class _`<Class>`_ (Optional)

&nbsp;&nbsp;Extended class


### root _`<String>`_ (Optional)

&nbsp;&nbsp;Anchor point can be attached to a child element

<br>
<br>

## Class rewriting API：
```js
import {Endpoint} from 'butterfly-dag';

Class YourEndpoint extends Endpoint {

  /**
    * Callback after anchor is mounted
    */
  mount() {}
  
  /**
    * Endpoint rendering method
    * @param {obj} data - Basic node information 
    * @return {dom} - Return the root node of the rendered dom
    */
  draw(obj) {}
  
  /**
    * When dragging the anchor point, set the linkable state callback when the connection is connected, and the linkable style can be defined
    * (You need to set this.theme.endpoint.linkableHighlight property to trigger this callback)
    */
  linkable() {}
  
  /**
    * The linkable state callback when the mouse is released to cancel the connection, and the cancel line style can be defined to be cleared
    * (Used in conjunction with linkable)
    */
  unLinkable() {}
  
  /**
    * When dragging the anchor point, set the linkable when connecting and hover to this anchor point. The state callback can define the hover state style of the linkable. 
    * (Used in conjunction with linkable)
    */
  hoverLinkable() {}
  
  /**
    * When the mouse is released to cancel the connection, the linkable and hover state are called back, and the style of the hover state of the linkable line segment can be defined clearly
    * (Used in conjunction with hoverLinkable)
    */
  unHoverLinkable() {}
}
```

### linkable & unLinkable


<img width="650" src="https://img.alicdn.com/imgextra/i2/O1CN01VNQ3v621www2JIRhN_!!6000000007050-1-tps-400-300.gif">

### hoverLinkable & unHoverLinkable

<img width="650" src="https://img.alicdn.com/imgextra/i4/O1CN01428w4x27Z1weiMNVy_!!6000000007810-1-tps-400-300.gif">

<br>
<br>

## External call API

### endpoint.updatePos(dom,orientation,pos)

*descripition*： When the position of the anchor point changes, you need to call this method to update the position of the anchor point and update the adjacent line segments

*params*

* `{dom} dom`Custom anchor
* `{array} orientation `direction
* `{array} pos`position

```js
updatePos = (dom,orientation,pos) => {}
```

### endpoint.moveTo ()

*descripition*： Method of moving anchor point coordinates

*params*

* `{number} x`The x coordinate of the moving position
* `{number} y`The y coordinate of the moving position

```js
moveTo = (obj) => {}
```

### endpoint.hasConnection()

*descripition*： Determine whether the anchor point is connected by a line segment

*return*

* `boolean`

```js
/**
  * Whether the endpoint has a connecting edge
  */
hasConnection = () => {}
```

### endpoint.emit(event,data)

*descripition*： The method of the anchor sending event, the canvas and any element can receive it.

*params*

* `{string} event`Send event name
* `{number} data`Send event data

```js
emit = (string, obj) => {}
```

### endpoint.on(event,callback)

*descripition*： The method of anchor receiving events can receive events on the canvas and any element.

*params*

* `{string} event`Receive event name
* `{function} callback`Receive event callback

```js
on = (string, function) => {}
```