### Force Layout
```
this.canvas = new Canvas({
  layout: {
    type: 'forceLayout',
    options: {
      link: {
        // 线条的距离
        distance: 50,
        // 线条的粗细
        strength: 1
      }
    },
  }
});

```


### Darge Layout
```
this.canvas = new Canvas({
  layout: {
    type: 'drageLayout',
    options: {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 40,
      controlPoints: false,
    },
  }
});
```


### Tree Layout
参考：[antvis/hierarchy](https://github.com/antvis/hierarchy)
```
import {TreeCanvas} from 'butterfly-dag';
this.canvas = new TreeCanvas({
  layout: {
    type: 'drageLayout',
    options: {
      rankdir: 'TB',
      nodesep: 40,
      ranksep: 40,
      controlPoints: false,
    },
  }
});
```
