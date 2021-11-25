# 线(Edge)

## 用法

```js
// 初始化画布渲染
canvas.draw({
  edges: [{
    source: 'point_1',
    target: 'point_2',
    sourceNode: 'node_1',
    targetNode: 'node_2',
    type: 'endpoint',
    arrow: true,
    arrowPosition: 0.5,
    arrowOffset: 0,  // 箭头的最终位置：线条长度 * arrowPosition + arrowOffset
    label: 'I am label'   //这里也可以传dom，当然也可以拓展父类的drawLabel来自定义label
  }],
  groups: ...
  nodes: ...
})

// 动态添加
canvas.addEdge({
  // 参考下面属性
  ...
})
```

<br>
<br>

## 属性 <a name='edge-attr'></a>

### id  _`<String>`_    (必填)
&nbsp;&nbsp;节点唯一标识
### type  _`<String>`_    (选填)
&nbsp;&nbsp;标志线条连接到节点还是连接到锚点。默认值为endpoint

```js
// endpoint类型线段: 锚点连接锚点的线段
{
  type: 'endpoint',
  sourceNode: '', //连接源节点id
  source: '',     //连接源锚点id
  targetNode: '', //连接目标节点id
  target: ''      //连接目标锚点id
}
// node类型线段: 节点连接节点的线段
{
  type: 'node',
  source: '',     //连接源节点id
  target: ''      //连接目标节点id
}
```

###  targetNode  _`<String>`_   (必填)
&nbsp;&nbsp;连接目标节点id (只有endpoint类型的线段才有)
### target  _`<String>`_    (必填)
&nbsp;&nbsp;连接目标锚点id (endpoint线段: 连接目标锚点id; node线段: 连接目标节点id)
### sourceNode  _`<String>`_   (必填)
&nbsp;&nbsp;连接源节点id (只有endpoint类型的线段才有)
### source  _`<String>`_   (必填)
&nbsp;&nbsp;连接源锚点id (endpoint线段: 连接源锚点id; node线段: 连接源节点id)
### orientationLimit  _`<Array>`_    (选填)
&nbsp;&nbsp;线条进出口的位置限制: Left / Right / Top / Bottom
### shapeType  _`<String>`_    (选填)
&nbsp;&nbsp;线条的类型: Bezier/Flow/Straight/Manhattan/AdvancedBezier/Bezier2-1/Bezier2-2/Bezier2-3/BrokenLine

<img width="650" src="https://img.alicdn.com/imgextra/i3/O1CN01sHnesN1SMIhN62CLK_!!6000000002232-2-tps-1418-404.png">

### label  _`<String/Dom>`_   (选填)
&nbsp;&nbsp;线条上注释: 可传字符串和dom
### labelPosition  _`<Number>`_   (选填)
&nbsp;&nbsp;线条上注释的位置: 取值0-1之间, 0代表代表在线段开始处，1代表在线段结束处。 默认值0.5
### labelOffset  _`<Number>`_   (选填)
&nbsp;&nbsp;线条上注释的位置的偏移值: 距离线段注释位置的偏移值。 默认值为0，单位是像素

```js
// labelPosition & labelOffset: 注释位置在线段中间处，再往结束方向偏移20px
{
  labelPosition: 0.5,
  labelOffset: 20
}
```

### arrow  _`<Boolean>`_    (选填)
&nbsp;&nbsp;是否加箭头配置: 默认false
### arrowPosition  _`<Number>`_   (选填)
&nbsp;&nbsp;箭头位置: 取值0-1之间, 0代表代表在线段开始处，1代表在线段结束处。 默认值0.5
### arrowOffset  _`<Number>`_   (选填)
&nbsp;&nbsp;箭头位置的偏移值: 距离线段箭头位置的偏移值。 默认值为0，单位是像素

```js
// arrowPosition & arrowOffset: 箭头位置在线段中间处，再往结束方向偏移20px
{
  arrowPosition: 0.5,
  arrowOffset: 20
}
```

### arrowShapeType _`<String>`_   (选填)
&nbsp;&nbsp;箭头样式类型: 可使用系统集成的和可使用自己注册的，只需要保证类型对应即可。

```js
// 自行注册的
import {Arrow} from 'butterfly-dag';
Arrow.registerArrow([{
  key: 'yourArrow1',
  type: 'svg',
  width: 10,   // 选填，默认8px
  height: 10,  // 选填，默认8px
  content: require('/your_fold/your_arrow.svg') // 引用外部svg
}, {
  key: 'yourArrow1',
  type: 'pathString',
  content: 'M5 0 L0 -2 Q 1.0 0 0 2 Z' // path的d属性
}]);
```

### [Manhattan]draggable  _`<Number>`_   (选填)
&nbsp;&nbsp;设置类型为Manhattan线段是否能拖动

<img width="650" src="https://img.alicdn.com/imgextra/i3/O1CN01OnHABO1VPSGb0PBbW_!!6000000002645-1-tps-400-300.gif">

### Class  _`<Class>`_    (选填)
&nbsp;&nbsp;拓展类：一般来说已经满足需要了，因为逻辑较为复杂，不建议拓展线的基类。当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法

`* 设置 isExpandWidth 为 true 时，获取 eventHandlerDom 用于挂载事件`

<br>
<br>

## 类重写API：
```js
import {Edge} from 'butterfly-dag';

Class YourEdge extends Edge {

  /**
    * 线段挂载后的回调
    */
  mount() {}

  /**
    * 线段是否能连接的方法
    * @return {boolean} - 返回该线段是否能连接。若返回true，则会生成线段；若返回false，则会把线段销毁。
    */
  isConnect() {}
  
  /**
    * 线段的渲染方法
    * @param {obj} data - 线段基本信息 
    * @return {dom} - 返回渲染svg dom的根节点
    */
  draw(obj) {}

  /**
    * 箭头的渲染方法
    * @param {string} pathString - 线段path的描绘字符串(path中的d属性)
    * @return {dom} - 返回箭头渲染dom的根节点
    */
  drawArrow() {path}

  /**
    * 注释的渲染方法
    * @param {string/dom} label - 注释的内容字符串或者是label的dom
    * @return {dom} - 返回注释渲染dom的根节点
    */
  drawLabel() {}

  /**
    * 自定义计算线段路径方法
    * @param {object} sourcePoint - 来源点的坐标及线段出线的方向
    * @param {object} targetPoint - 目标点的坐标及线段入线的方向
    * @return {string} - 返回线段path的描绘字符串(path中的d属性)
    */
  calcPath(sourcePoint, targetPoint) {}
}
```

<br>
<br>

## 外部调用API

### edge.redraw ()

*作用*： 更新线段位置: 线段所在的节点或者锚点位置发生变化后, 需要调用下redraw更新其对应的线

```js
redraw = () => {}
```

### edge.setZIndex (index)

*作用*： 设置线段的z-index值

*参数*

* `{number} zIndex`zIndex的值

```js
setZIndex = (index) => {}
```

### edge.updateLabel (label)

*作用*： 更新线段的注释

*参数*

* `{string|dom}`label的字符串或者dom

*返回*

* `{dom}`更新label的dom

```js
updateLabel = (label) => {}
```

### edge.remove ()

*作用*： 线段删除的方法。与canvas.removeEdge的方法作用一致。

```js
remove = () => {}
```

### edge.emit(event,data)

*作用*： 线段发送事件的方法，画布及任何一个元素都可接收。

*参数*

* `{string} event`发送事件名称
* `{number} data`发送事件数据

```js
emit = (string, obj) => {}
```

### edge.on(event,callback)

*作用*： 线段接收事件的方法，能接收画布及任何一个元素的事件。

*参数*

* `{string} event`接收事件名称
* `{function} callback`接收事件回调

```js
on = (string, function) => {}
```

### edge.addAnimate (options)

*作用*： 给该线段加上动画

*参数*

* `{obj} options(可选参数)`配置动画效果
* `{number} options.radius (可选参数)`动画节点半径
* `{string} options.color (可选参数) `动画节点颜色
* `{string} options.dur (可选参数)`动画运行时间，如：1s
* `{number|string} options.repeatCount (可选参数)`动画重复次数，如：1 或者 'indefinite'

```js
addAnimate = (options) => {}
```

<img width="650" src="https://img.alicdn.com/tfs/TB1anoGvkL0gK0jSZFAXXcA9pXa-921-532.gif">
性能: 1000节点+1000条线段，动画完美运行
<img width="650" src="https://img.alicdn.com/tfs/TB1N4a_wi_1gK0jSZFqXXcpaXXa-662-466.gif">

### [Manhattan]edge.getBreakPoints ()

*作用*： 获取线段拐点: 只有shapeType为Manhattan的线段才会使用此方法。

```js
getBreakPoints = () => {}
```