# 锚点(Endpoint)

## 用法
```
// 用法一:
canvas.draw({
  nodes: [{
    ...
    endpoints: [{
      id: 'point_1',
      type: 'target',
      orientation: [-1, 0],
      pos: [0, 0.5]
    }]
  }]
})

// 用法二:
let node = this.canvas.getNode('xxx');
node.addEndpoint({
  id: 'xxxx',
  type: 'target',
  dom: dom           // 使用此属性用户可以使用任意的一个dom作为一个锚点
});
```

## 属性
| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| id | 节点唯一标识 | string (Require) | - 
| orientation | 方向 | array (Option) | 下:[0,1]/上:[0,-1]/右:[1,0]/左:[-1,0]
| pos | 位置 | array (Option) | - 
| scope | 作用域 | string (Option) | 锚点scope相同才可以连线
| type | 目标锚点还是源锚点 | string (Option) | 'source' / 'target' / undefined，当undefined的时候锚点既是source又是target
| disLinkable | 禁止锚点拖动断开线段 | boolean (Option) | 该属性仅限用于'target'的锚点
| root | 可把锚点附属与某个子元素 | string (Option) | - 
| Class | 拓展类 | Class (Option) | 当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
| dom | 可以把此dom作为自定义锚点 | dom (Option) | - 
| expendArea | 可以设置锚点连接的热区，可覆盖主题内的设置 | Object (Option) | {left:10, right:10, top:10, bottom:10}

## 方法
```
/**
  * @return {dom} - 自定义节点的dom
  */
draw = () => {}

/**
  * 锚点挂载后的回调
  */
mounted = () => {}

/**
  * 锚点更新后的回调
  */
updated = () => {}

/**
  * @param {number} x - 移动位置的x坐标 
  * @param {number} y - 移动位置的y坐标 
  */
moveTo = (obj) => {}

/**
  * 设置连线时linkable的状态 (需要设置this.theme.endpoint.linkableHighlight属性)
  */
linkable = () => {}

/**
  * 取消连线时linkable的状态
  */
unLinkable = () => {}

/**
  * 设置连线时linkable并且hover状态 (需要设置this.theme.endpoint.linkableHighlight属性)
  */
hoverLinkable = () => {}

/**
  * 取消连线时linkable并且hover状态
  */
unHoverLinkable = () => {}

```

