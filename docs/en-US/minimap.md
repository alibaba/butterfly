# Minimap

Provide public Minimap services and settings property for butterfly

## Usage for butterfly

```js
// in butterfly
canvas.setMinimap(true, {/* options */})

// close minimap
canvas.setMinimap(false)

```

<br>
<br>

## Property（options）

### root _`<DOMNode>`_（Require）
&nbsp;&nbsp;root canvas dom
### height _`<Number>`_ (Optional)
&nbsp;&nbsp;minimap height，default：`200`
### width _`<Number>`_ (Optional)
&nbsp;&nbsp;minimap width，default：`200`
### className _`<String>`_ (Optional)
&nbsp;&nbsp;minimap container class name，default：`butterfly-minimap-container`
### containerStyle _`<Object>`_ (Optional)
&nbsp;&nbsp;minimap container css
### viewportStyle _`<Object>`_ (Optional)
&nbsp;&nbsp;minimap view css
### backgroudStyle _`<Object>`_ (Optional)
&nbsp;&nbsp;minimap backgroud css
### nodeColor _`<String>`_ (Optional)
&nbsp;&nbsp;node color，default：`rgba(255, 103, 101, 1)`
### groupColor _`<String>`_ (Optional)
&nbsp;&nbsp;group color，default：`rgba(0, 193, 222, 1)`
### nodes _`<Array>`_ (Optional)
&nbsp;&nbsp;group data，default：`[ ]`
```ts
interface Node {
  id: number | string;    // Node ID
  group: number | string; // Node group ID
  left: number;           // Abscissa
  top: number;            // Y-axis
  width: number;          // width
  height: number;         // height
  minimapActive: boolean; // Is currently active
}
```
### groups _`<Array>`_ (Optional)
&nbsp;&nbsp;group data，default：`[ ]`
```ts
interface Group {
  id: number | string;      // Node group ID
  left: number;             // Abscissa
  top: number;              // Y-axis
  width: number;            // width  
  height: number;           // height
  options: {
    minimapActive: boolean; // Is currently active
  }
}
```
### offset _`<Array>`_ (Optional)
&nbsp;&nbsp;canvas offset，default：`[0, 0]`
### zoom _`<Number>`_ (Optional)
&nbsp;&nbsp;canvas zoom，default：`1`
### move _`<Function>`_（Require）
&nbsp;&nbsp;minimap interaction function for moving the canvas, referring to butterfly's move function
```ts
interface MoveFn {
  ([x: number, y: number]): void
}
```
### terminal2canvas _`<Function>`_ （Require）
&nbsp;&nbsp;interaction function for butterfly's convert coordinate the canvas
```ts
interface Term2CvsFn {
  ([x: number, y: number]): [x: number, y: number]
}
```
### canvas2terminal _`<Function>`_（Require）
&nbsp;&nbsp;interaction function for canvas's convert to coordinate of screen 
```ts
interface Cvs2TermFn {
  ([x: number, y: number]): [x: number, y: number]
}
```
### safeDistance _`<Number>`_ (Optional)
&nbsp;&nbsp;safe distance to protect user from moving viewport window outside of minimap，default：`20`
### activeNodeColor _`<String>`_ (Optional)
&nbsp;&nbsp;active node color，default：`rgba(255, 253, 76, 1)`
### activeGroupColor _`<String>`_ (Optional)
&nbsp;&nbsp;active group color，default：`rgba(255, 253, 76, 1)`
### events _`<Number>`_ (Optional)
&nbsp;&nbsp;events to call minimap redraw，default：`[ ]`

<br>
<br>

## Used in other systems

```js
// in other system
const Minimap = require('butterfly-dag').Minimap;

// Create a Minimap
minimap = new Minimap({
  root: HTMLElement,
  move: () => null,
  terminal2canvas: () => null,
  // Incoming initial data for initial rendering
  nodes: [],
  groups: [],
  zoom: 1,
  offset: []
});

// Update Minimap data
minimap.update({
  nodes: this.nodes,
  groups: this.groups,
  zoom: this.getZoom(),
  offset: this.getOffset()
});

// destroy
minimap.destroy();

```
