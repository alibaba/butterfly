# 节点组(Group)

```
const Group = require('butterfly-dag').Group;
class AGroup extends Group {
  draw(obj) {
    // 这里可以根据业务需要，自己生成dom
  }
}

canvas.draw({
  groups: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: AGroup //设置基类之后，画布会根据自定义的类来渲染
  }],
  nodes: ...
  edges: ...
})
```

## 属性

| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| id | 节点唯一标识 | string (Require) | - 
| top | y轴坐标 | number (Require) | - 
| left | x轴坐标 | number (Require) | - 
| width | 宽度 | number (Option) | - 
| height | 高度 | number (Option) | - 
| endpoints | 锚点信息 | array (Option) | - 
| Class | 拓展类 | Class (Option) | 当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
| scope | 作用域 | boolean (Option) | 当node的scope和group的scope一致才能加入到节点组。默认不设置即可随意加入

`* 节点的返回的dom必须设置position: absolute;`

## 方法

```
/**
  * group的渲染方法
  * @param {obj} data - 节点基本信息 
  * @return {dom} - 返回渲染dom的根节点
  */
draw = (obj) => {}

/**
  * 节点组挂载后的回调
  */
mounted = () => {}

/**
  * group添加节点
  * @param {obj} node - 节点数据
  */
addNode = (node) => {}

/**
  * group批量添加节点
  * @param {array} nodes - 节点数组
  */
addNodes = (nodes) => {}

/**
  * group删除节点
  * @param {obj} node - 节点数据
  */
removeNode = (node) => {}

/**
  * group删除节点
  * @param {array} nodes - 节点数组
  */
removeNodes = (nodes) => {}

/**
  * @param {obj} data - 锚点基本信息(此方法必须在节点挂载后执行才有效)
  */
addEndpoint = (obj) => {}

/**
  * @param {string} pointId - 锚点的信息 
  * @return {Endpoint} - Endpoint的对象
  */
getEndpoint = (id) => {}

/**
  * @return {number} - 节点组宽度
  */
getWidth = () => {}

/**
  * @return {number} - 节点组高度
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

## 详细说明