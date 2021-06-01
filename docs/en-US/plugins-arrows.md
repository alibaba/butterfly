# Arrow

## Custom Arrow

### Register arrow type

```js
import {Arrow} from 'butterfly-dag';
Arrow.registerArrow([{
  key: 'yourArrow1',
  type: 'svg',
  width: 10,   // (Optional), default `8px`
  height: 10,  // (Optional), default `8px`
  content: require('/your_fold/your_arrow.svg') // reference external svg
}, {
  key: 'yourArrow1',
  type: 'pathString',
  content: 'M5 0 L0 -2 Q 1.0 0 0 2 Z' // `d` attribute of path
}]);

```

### Usage
```js
// method 1: Set the default theme, all arrows will take effect
let canvas = new Canvas({
  theme: {
    edge: {
      arrow: true,
      arrowShapeType: 'yourArrow1'
    }
  }
});

// Method 2: Set the arrow style of a certain edge
canvas.addEdge({
  id: '',
  arrow: true,
  arrowShapeType: 'yourArrow1',
  ...
})
```

### System Arrow

<img width="650" src="https://img.alicdn.com/imgextra/i4/O1CN01uousZW1cXss5NpeoX_!!6000000003611-2-tps-1418-316.png">

### 外部引入箭头

&nbsp;&nbsp;&nbsp;&nbsp;User registered svg or arrow with custom path. In addition, we have supported the svg downloaded by `Iconfont` to be used as the style of the arrow. `Iconfont` is a good choice for you.