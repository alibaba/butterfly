# 缩略图(Minimap)

提供通用的Minimap服务和专属小蝴蝶的设置选项

## 小蝴蝶中使用

```js
// in butterfly
canvas.setMinimap(true, {/* options */})

// 停止使用
canvas.setMinimap(false)

```

<br>
<br>

## 属性说明（options）

### root _`<DOMNode>`_（必填）
&nbsp;&nbsp;画布容器
### height _`<Number>`_ (选填)
&nbsp;&nbsp;缩略图高度，默认值：`200`
### width _`<Number>`_ (选填)
&nbsp;&nbsp;缩略图宽宽度，默认值：`200`
### className _`<String>`_ (选填)
&nbsp;&nbsp;缩略图容器 class name，默认值：`butterfly-minimap-container`
### containerStyle _`<Object>`_ (选填)
&nbsp;&nbsp;缩略图容器 css
### viewportStyle _`<Object>`_ (选填)
&nbsp;&nbsp;视口 css
### backgroudStyle _`<Object>`_ (选填)
&nbsp;&nbsp;背景 css
### nodeColor _`<String>`_ (选填)
&nbsp;&nbsp;节点颜色，默认值：`rgba(255, 103, 101, 1)`
### groupColor _`<String>`_ (选填)
&nbsp;&nbsp;节点组颜色，默认值：`rgba(0, 193, 222, 1)`
### nodes _`<Array>`_ (选填)
&nbsp;&nbsp;节点数据，默认值：`[ ]`
```ts
interface Node {
  id: number | string;    // 节点ID
  group: number | string; // 节点组ID
  left: number;           // 横坐标
  top: number;            // 纵坐标
  width: number;          // 宽度
  height: number;         // 高度
  minimapActive: boolean; // 当前是否处于激活态
}
```
### groups _`<Array>`_ (选填)
&nbsp;&nbsp;节点组数据，默认值：`[ ]`
```ts
interface Group {
  id: number | string;      // 节点组ID
  left: number;             // 横坐标
  top: number;              // 纵坐标
  width: number;            // 宽度  
  height: number;           // 高度
  options: {
    minimapActive: boolean; // 当前是否处于激活态
  }
}
```
### offset _`<Array>`_ (选填)
&nbsp;&nbsp;画布偏移信息，默认值：`[0, 0]`
### zoom _`<Number>`_ (选填)
&nbsp;&nbsp;画布当前缩放比，默认值：`1`
### move _`<Function>`_（必填）
&nbsp;&nbsp;缩略图互动函数, 用于移动画布, 参考小蝴蝶的move
```ts
interface MoveFn {
  ([x: number, y: number]): void
}
```
### terminal2canvas _`<Function>`_ （必填）
&nbsp;&nbsp;互动函数, 屏幕坐标到画布坐标的转换
```ts
interface Term2CvsFn {
  ([x: number, y: number]): [x: number, y: number]
}
```
### canvas2terminal _`<Function>`_（必填）
&nbsp;&nbsp;互动函数, 画布坐标转换到屏幕坐标
```ts
interface Cvs2TermFn {
  ([x: number, y: number]): [x: number, y: number]
}
```
### safeDistance _`<Number>`_ (选填)
&nbsp;&nbsp;安全距离，用于限制用户将视口拖出minimap，默认值：`20`
### activeNodeColor _`<String>`_ (选填)
&nbsp;&nbsp;高亮的节点的颜色，默认值：`rgba(255, 253, 76, 1)`
### activeGroupColor _`<String>`_ (选填)
&nbsp;&nbsp;高亮的节点组的颜色，默认值：`rgba(255, 253, 76, 1)`
### events _`<Number>`_ (选填)
&nbsp;&nbsp;触发minimap重绘的事件，默认值：`[ ]`

<br>
<br>

## 其他系统中使用

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