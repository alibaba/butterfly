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

## 属性

### id <string>(必填)
  节点唯一标识
###  targetNode  <string>(必填)
  连接目标节点id
### target <string>(必填)
  连接目标锚点id
### sourceNode <string>(必填)
  连接源节点id
### source <string>(必填)
  连接源锚点id
### type <string> (选填)
  标志线条连接到节点还是连接到锚点
### orientationLimit <array> (选填)
  线条出口的位置
### shapeType <string> (选填)
  线条的类型
### label <string/dom>(选填)
  线条上加注释
### arrow <boolean> (选填)
  线条上加箭头
### Class <Class> (选填)
  拓展类
### arrowPosition <float> (选填)
  箭头在线条上的位置
### arrowOffset <float> (选填)
  箭头相对于arrowPosition的偏移量

`* 设置 isExpandWidth 为 true 时，获取 eventHandlerDom 用于挂载事件`

## API：

### edge.draw()

返回

* `{dom}` 自定义节点的dom

```js
draw = () => {}
```

### edge.calcPath()

参数

* ` {obj} sourcePoint(可选参数)`源节点的坐标和方向
* ` {obj} targetPoint(可选参数) `目标节点的坐标和方向 

返回

* `{string}`path的路径

```js
calcPath = () => {}
```

### edge.mounted()

```js
mounted = () => {}
```

### edge.updated ()

```js
updated = () => {}
```

###edge.setZIndex (index)

参数

* `{number} zIndex`zIndex的值

```js
setZIndex = (index) => {}
```

###edge.drawArrow () 

返回

* `{dom}`自定义箭头的dom

```js
drawArrow = () => {}
```

### edge.drawLabel ()

返回

* `{dom}`自定义label的dom

```js
drawLabel = () => {}
```

### edge.updateLabel (label)

参数

* `{string|dom}`label的字符窜或者节点

返回

* `{dom}`更新label的dom

```js
updateLabel = (label) => {}
```

### edge.isConnect ()

返回

* ` {boolean}`可以自定义复杂的连接条件

```js
isConnect = () => {}
```

### edge.emit (event, data)

* `{string} event` 发送事件名称
* `{obj}data` 发送事件数据

```js
emit = (string, obj) => {}
```

### edge.on (string, callback)

* `{string} event` 接收事件名称
* `{function}data` 接收事件数据

```js
on = (string, callback) => {}
```

### edge.addAnimate (options)

参数

* `{obj} options(可选参数)`配置动画效果
* `{number} options.radius (可选参数)`动画节点半径
* `{string} options.color (可选参数) `动画节点颜色
* `{string} options.dur (可选参数)`动画运行时间，如：1s
* `{number|string} options.repeatCount (可选参数)`动画重复次数，如：1 或者 'indefinite'

```js
addAnimate = (options) => {}
```

<img width="600" src="https://img.alicdn.com/tfs/TB1anoGvkL0gK0jSZFAXXcA9pXa-921-532.gif">
ps: 1000节点+1000条线段，动画完美运行
<img width="600" src="https://img.alicdn.com/tfs/TB1N4a_wi_1gK0jSZFqXXcpaXXa-662-466.gif">
