# 线(Edge)

### 属性
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
| arrowPosition | 箭头在线条的位置 | float (Option) | 0-1之间，默认0.5


`* 设置 isExpandWidth 为 true 时，获取 eventHandlerDom 用于挂载事件`

### 方法

```
/**
  * @return {dom} - 自定义节点的dom
  */
draw = () => {}
/**
  * 线条挂载后的回调
  */
mounted = () => {}
/**
  * 线条重绘后的回调
  */
updated = () => {}
/**
  * @return {dom} - 自定义label的dom
  */
drawLabel = () => {}
/**
  * @return {dom} - 自定义箭头的dom
  */
drawArrow = () => {}
/**
  * @param {obj} sourcePoint(可选参数) - 源节点的坐标和方向 
  * @param {obj} targetPoint(可选参数) - 目标节点的坐标和方向 
  * @return {string} - path的路径
  */
calcPath = () => {}
/**
  * 发送事件
  */
emit = (string, obj) => {}
/**
  * 接受事件
  */
on = (string, callback) => {}
```

### 详细说明
