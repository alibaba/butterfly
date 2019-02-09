# 锚点(Endpoint)

### 属性
| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| id | 节点唯一标识 | string (Require) | - 
| orientation | 方向 | array (Option) | 下:[0,1]/上:[0,-1]/右:[1,0]/左:[-1,0]
| pos | 连接目标锚点id | string (Option) | - 
| scope | 作用域 | string (Option) | 锚点scope相同才可以连线
| type | 目标锚点还是源锚点 | string (Require) | 'source' / 'target'
| root | 可把锚点附属与某个子元素 | string (Option) | - 
| dom | 可以把自定义的子节点 | dom (dom) | - 

### 方法
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
```

### 详细说明
