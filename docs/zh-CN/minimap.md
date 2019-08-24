# 缩略图(Minimap)

提供通用的Minimap服务和专属小蝴蝶的设置选项

## 一，小蝴蝶中使用

```js
// in butterfly
canvas.setMinimap(true, {/* options */})

// 停止使用
canvas.setMinimap(false)

```

## 二，其他系统中使用

```js
// in other system
const Minimap = require('butterfly-dag').Minimap;

// 新建一个 Minimap
minimap = new Minimap({
  root: HTMLElement,
  move: () => null,
  terminal2canvas: () => null,
  // 传入初始数据, 用于初始渲染
  nodes: [],
  groups: [],
  zoom: 1,
  offset: []
});

// 更新 Minimap 数据
minimap.update({
  nodes: this.nodes,
  groups: this.groups,
  zoom: this.getZoom(),
  offset: this.getOffset()
});

// 销毁
minimap.destroy();

```

## 三，选项说明

### 1, options

| 选项 | 说明 | 默认值 |
| ---- | ---- | ---- |
| root | 画布容器 | null(必填) | 
| height | 缩略图高度 | 200 |
| width  | 缩略图宽度 | 200 |
| className | 缩略图容器 class name | `butterfly-minimap-container` |
| containerStyle | 缩略图容器 css | |
| viewportStyle | 视口 css | |
| backgroudStyle  | 背景 css | |
| nodeColor | 节点颜色 | `rgba(255, 103, 101, 1)` |
| groupColor | 节点组颜色 | `rgba(0, 193, 222, 1)` |
| nodes | 节点数据, 具体参考下方描述 | [] |
| groups | 节点组数据, 具体参考下方描述 | [] |
| offset | 画布偏移信息 | [0, 0] | 
| zoom | 画布当前缩放比 | 1 |
| move | 缩略图互动函数, 用于移动画布, 参考小蝴蝶的move | 必填 |
| terminal2canvas | 互动函数, 屏幕坐标到画布坐标的转换 | 必填 |

### 2, 具体描述

**(1) nodes**
```ts
interface Node {
  id: number | string;    // 节点ID
  group: number | string; // 节点组ID
  left: number;           // 横坐标
  top: number;            // 纵坐标
  width: number;          // 宽度
  height: number;         // 高度
}
```

**(2) groups**
```ts
interface Group {
  id: number | string;    // 节点组ID
  left: number;           // 横坐标
  top: number;            // 纵坐标
  width: number;          // 宽度  
  height: number;         // 高度
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