# 线(Edge)

## 用法

```js
canvas.draw({
  edges: [{
    source: 'point_1',
    target: 'point_2',
    sourceNode: 'node_1',
    targetNode: 'node_2',
    type: 'endpoint',
    arrow: ture,
    arrowPosition: 0.5,
    arrowOffset: 0,  // 箭头的最终位置：线条长度 * arrowPosition + arrowOffset
    label: 'I am label'   //这里也可以传dom，当然也可以拓展父类的drawLabel来自定义label
  }],
  groups: ...
  nodes: ...
})
```

## 属性<a name='edge-attr'></a>：

| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| id | 节点唯一标识 | string (Require) | - 
| targetNode | 连接目标节点id | string (Require) | - 
| target | 连接目标锚点id | string (Require) | - 
| sourceNode | 连接源节点id | string (Require) | - 
| source | 连接源锚点id | string (Require) | - 
| type | 标志线条连接到节点还是连接到锚点 | string (Option) | endpoint/node
| orientationLimit | 线条出口的位置 | array (Option) | - 
| shapeType | 线条的类型 | string (Option) | Bezier/Flow/Straight
| label | 线条上加注释 | string/dom (Option) | -
| arrow | 线条上加箭头 | boolean (Option) | 默认false
| Class | 拓展类 | Class (Option) | `一般来说已经满足需要了，因为逻辑较为复杂，不建议拓展线的基类。`当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
| arrowPosition | 箭头在线条上的位置 | float (Option) | 0-1之间，默认0.5
| arrowOffset | 箭头相对于arrowPosition的偏移量 | float (Option) | 默认0，单位：像素

`* 设置 isExpandWidth 为 true 时，获取 eventHandlerDom 用于挂载事件`

## API：

### <a name='edge-custom-dom'>自定义线段</a>：

```js
/**
  * @return {dom} - 自定义节点的dom
  */
draw = () => {}

/**
  * @param {obj} sourcePoint(可选参数) - 源节点的坐标和方向 
  * @param {obj} targetPoint(可选参数) - 目标节点的坐标和方向 
  * @return {string} - path的路径
  */
calcPath = () => {}

/**
  * 线条挂载后的回调
  */
mounted = () => {}

/**
  * 线条重绘后的回调
  */
updated = () => {}
```

### <a name='edge-custom-arrow'>自定义箭头</a>：

```js
/**
  * @return {dom} - 自定义箭头的dom
  */
drawArrow = () => {}

```

### <a name='edge-custom-label'>自定义label</a>：
```js
/**
  * @return {dom} - 自定义label的dom
  */
drawLabel = () => {}
```

### <a name='edge-isConnect'>线段连通性</a>：
```js
/**
  * ps：判断线段连通性的两种方法
  * 简单方法一：通过锚点的scope，相连的2个锚点scope一致即可连接
  * 复杂的方法二：通过isConnect函数判断，返回true则可连，返回false则不可连
  */

/**
  * @return {boolean} - 可以自定义复杂的连接条件
  */
isConnect = () => {}

```

### <a name='edge-event'>事件</a>：

```js

/**
  * 发送事件
  */
emit = (string, obj) => {}

/**
  * 接受事件
  */
on = (string, callback) => {}
```

### <a name='edge-animation'>动画</a>：
```js
/**
  * 开启动画
  * @param {obj} options(可选参数) - 配置动画效果
  * @param {number} options.radius (可选参数) - 动画节点半径
  * @param {string} options.color (可选参数) - 动画节点颜色
  * @param {string} options.dur (可选参数) - 动画运行时间，如：1s
  * @param {number|string} options.repeatCount (可选参数) - 动画重复次数，如：1 或者 'indefinite'
  */
addAnimate = (options) => {}

```

<img width="600" src="https://img.alicdn.com/tfs/TB1anoGvkL0gK0jSZFAXXcA9pXa-921-532.gif">
ps: 1000节点+1000条线段，动画完美运行
<img width="600" src="https://img.alicdn.com/tfs/TB1N4a_wi_1gK0jSZFqXXcpaXXa-662-466.gif">
