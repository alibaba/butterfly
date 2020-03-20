# Minimap

Provide public Minimap services and settings property for butterfly

## 一，Usage for butterfly

```js
// in butterfly
canvas.setMinimap(true, {/* options */})

// close minimap
canvas.setMinimap(false)

```

## 二，Usage for other app

```js
// in other system
const Minimap = require('butterfly-dag').Minimap;

// create a new Minimap
minimap = new Minimap({
  root: HTMLElement,
  move: () => null,
  terminal2canvas: () => null
});

// update Minimap data
minimap.update({
  nodes: this.nodes,
  groups: this.groups,
  zoom: this.getZoom(),
  offset: this.getOffset()
});

// destroy minmap
minimap.destroy();

```

## 三，Property

### 1, options

| key | describe | default 
| ---- | ---- | ---- |
| root | root canvas dom | null(必填) | 
| height | minimap height | 200 |
| width  | minimap width | 200 |
| className | minimap container class name | `butterfly-minimap-container` |
| containerStyle | minimap container css | |
| viewportStyle | minimap view css | |
| backgroudStyle  | minimap backgroud css | |
| nodeColor | node color | `rgba(255, 103, 101, 1)` |
| groupColor | group color | `rgba(0, 193, 222, 1)` |
| nodes | node data, refer specifically to the description below. | [] |
| groups | group data, refer specifically to the description below.  | [] |
| offset | canvas offset | [0, 0] | 
| zoom | canvas zoom | 1 |
| move | minimap interaction function for moving the canvas, referring to butterfly's move function | Require |
| terminal2canvas | interaction function for butterfly's convert coordinate the canvas | Require |
| canvas2terminal | interaction function for canvas's convert to coordinate of screen   | Require |
| safeDistance | safe distance to protect user from moving viewport window outside of minimap | 20 |
| activeNodeColor | active node color | `rgba(255, 253, 76, 1)` |
| activeGroupColor | active group color | `rgba(255, 253, 76, 1)` |
| events | events to call minimap redraw | [] |

### 2, Detail

**(1) nodes**
```ts
interface Node {
  id: number | string;    // node ID
  group: number | string; // group ID
  left: number;           // x coordinate
  top: number;            // y coordinate
  width: number;          // width
  height: number;         // height
  minimapActive: boolean; // active status
}
```

**(2) groups**
```ts
interface Group {
  id: number | string;      // node ID
  left: number;             // x coordinate
  top: number;              // y coordinate
  width: number;            // width  
  height: number;           // height
  options: {
    minimapActive: boolean; // active status
  }  
}
```

**(3) move**
```ts
interface MoveFn {
  ([x: number, y: number]): void
}
```


**(4) terminal2canvas**
```ts
interface Term2CvsFn {
  ([x: number, y: number]): [x: number, y: number]
}
```

**(5) canvas2terminal**
```ts
interface Cvs2TermFn {
  ([x: number, y: number]): [x: number, y: number]
}
```