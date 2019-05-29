# 节点(Node)

## 用法
```
const Node = require('butterfly-dag').Node;
class ANode extends Node {
  draw(obj) {
    // 这里可以根据业务需要，自己生成dom
  }
}

canvas.draw({
  nodes: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: ANode //设置基类之后，画布会根据自定义的类来渲染
  }]
})
```

## 属性

| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| id | 节点唯一标识 | string (Require) | - 
| top | y轴坐标 | number (Require) | - 
| left | x轴坐标 | number (Require) | - 
| draggable | 可以设置该节点是否能拖动 | boolean (Option) | 可覆盖全局的draggable属性
| group | group的唯一标识 | string (Option) | - 
| endpoints | 锚点信息 | array (Option) | - 
| Class | 拓展类 | Class (Option) | 当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
| scope | 作用域 | boolean (Option) | 当node的scope和group的scope一致才能加入到节点组。默认不设置即可随意加入

`* 节点的返回的dom必须设置position: absolute;`

## 方法
```
/**
  * 节点的渲染方法
  * @param {obj} data - 节点基本信息 
  * @return {dom} - 返回渲染dom的根节点
  */
draw = (obj) => {}

/**
  * 节点挂载后的回调
  */
mounted = () => {}

/**
  * 节点更新后的回调
  */
updated = () => {}

/**
  * 删除节点
  */
remove = () => {}

/**
  * 聚焦回调
  */
focus = () => {}

/**
  * 失去聚焦回调
  */
unFocus = () => {}

/**
  * @param {obj} data - 锚点基本信息(此方法必须在节点挂载后执行才有效)
  */
addEndpoint = (obj) => {}

/**
  * @param {string} pointId - 锚点的Id(此方法必须在节点挂载后执行才有效)
  * @return {Endpoint} - Endpoint的对象
  */
removeEndpoint = (obj) => {}

/**
  * @param {string(Require)} pointId - 锚点的信息 
  * @param {string(Option)} type - 锚点的类型
  * @return {Endpoint} - Endpoint的对象
  */
getEndpoint = (id, type) => {}

/**
  * @param {number} x - 移动位置的x坐标 
  * @param {number} y - 移动位置的y坐标 
  */
moveTo = (obj) => {}

/**
  * @param {boolean} draggable - 设置节点是否可移动
  */
setDraggable = (boolean) => {}

/**
  * @return {number} - 节点宽度
  */
getWidth = () => {}

/**
  * @return {number} - 节点高度
  */
getHeight = () => {}

/**
  * 发送事件
  */
emit = (string, obj) => {}

/**
  * 接受事件
  */
on = (string, callback) => {}
```

