# 节点组(Group)

```js
const Group = require('butterfly-dag').Group;
class AGroup extends Group {
  draw(obj) {
    // 这里可以根据业务需要，自己生成dom
  }
}

// 初始化画布渲染
canvas.draw({
  groups: [{
    id: 'xxxx',
    top: 100,
    left: 100,
    Class: AGroup //设置基类之后，画布会根据自定义的类来渲染
    ...
    // 参考下面属性
  }],
  nodes: ...
  edges: ...
})

// 动态添加
canvas.addGroup({
  ...
  // 参考下面属性
});
```
<br>

**`节点组的返回的dom必须设置position: absolute;`**

<br>
<br>

## 属性 <a name='group-attr'></a>

### id _`<String>`_ （必填）
&nbsp;&nbsp;节点唯一标识
### top _`<Number>`_ （必填）
&nbsp;&nbsp;y轴坐标
### left _`<Number>`_ （必填）
&nbsp;&nbsp;x轴坐标
### width _`<Number>`_ (选填)
&nbsp;&nbsp;宽度
### height _`<Number>`_ (选填)
&nbsp;&nbsp;高度
### endpoints _`<Array>`_ (选填)
&nbsp;&nbsp;系统锚点配置: 当有此配置会加上系统的锚点
### Class _`<Class>`_ (选填)
&nbsp;&nbsp;拓展类：当传入拓展类的时候，该节点组则会按拓展类的draw方法进行渲染，拓展类的相关方法也会覆盖父类的方法
### scope _`<String>`_ (选填)
&nbsp;&nbsp;作用域: 当scope一致的节点才能拖动进入节点组

```js
// 单scope
group.scope = 'xxx';
// 多scope，任意一个匹配中都能连接
group.scope = 'xxx1 xxx2 xxx3';
```

### draggable _`<Boolean>`_ (选填)
&nbsp;&nbsp;节点组可拖动标识。默认可拖动
### resize _`<Boolean>`_ (选填)
&nbsp;&nbsp;节点组大小可变标识。默认可变

<img width="650" src="https://img.alicdn.com/imgextra/i4/O1CN01nb2APF1ZM1lbFNKM1_!!6000000003179-1-tps-400-300.gif">

### group _`<String>`_ (选填)
&nbsp;&nbsp;父级group的id: 需要开启canvas.theme.group.includeGroups的属性才能支持group嵌套
  
<img width="650" src="https://img.alicdn.com/imgextra/i4/O1CN01qmOWWj1CKtcvZZJ7Q_!!6000000000063-2-tps-842-536.png">

<br>
<br>

## 类重写API：

```js
import {Group} from 'butterfly-dag';

Class YourGroup extends Group {
  
  /**
    * 节点组挂载后的回调
    */
  mount() {}

  /**
    * group的渲染方法
    * @param {obj} data - 节点基本信息 
    * @return {dom} - 返回渲染dom的根节点
    */
  draw(obj) {}
}
```

<br>
<br>

## 外部调用API：

### group.getWidth()

*作用*： 获取节点组宽度

*返回*

* `number`节点组宽度

```js
getWidth = () => {}
```

### group.getHeight ()

*作用*： 获取节点组高度

*返回*

/**
  * @return {number} - 节点组高度
  */
``` js
getHeight = () => {}
```

### group.setSize(width, height)

*作用*： 设置节点组的大小

*参数*

* `{number} width`节点组宽度

* `{number} height`节点组高度

```js
setSize = (width, height) => {}
```

### group.addNode (node)

*作用*： 节点组添加单个节点的方法

*参数*

### <a name='group-member'>新增，删除成员节点</a>：

```js
/**
  * group添加节点
  * @param {obj} node - 节点数据
  */
addNode = (node) => {}
```

### group.addNodes (nodes)

*作用*： 节点组添加多个节点的方法

*参数*

* `{array} nodes`节点数组

/**
  * group批量添加节点
  * @param {array} nodes - 节点数组
  */
addNodes = (nodes) => {}

*作用*： 节点组删除单个节点的方法

*参数*

* `{obj} node`节点数据

```js
removeNode = (node) => {}
```

### group.removeNodes (nodes)

*作用*： 节点组删除多个节点的方法

*参数*

```js
/**
  * group删除节点
  * @param {array} nodes - 节点数组
  */
removeNodes = (nodes) => {}
```

### group.addEndpoint (obj)

*作用*： 节点组添加锚点的方法

*参数*

* `{obj} param`锚点基本信息(此方法必须在节点挂载后执行才有效)
* `{string} param.id`锚点id
* `{string} param.orientation`锚点方向(可控制线段的进行和外出方向)
* `{string} param.scope`作用域
* `{string} param.type`'source' / 'target' / undefined / 'onlyConnect'，可看锚点的type文档
* `{string} param.dom`可以把分组内的任意一个子dom作为自定义锚点

```js
/**
  * @param {obj} param - 锚点基本信息(此方法必须在节点挂载后执行才有效)
  * @param {string} param.id - 锚点id
  * @param {string} param.orientation - 锚点方向(可控制线段的进行和外出方向)
  * @param {string} param.scope - 作用域
  * @param {string} param.type - 'source' / 'target' / undefined，当undefined的时候锚点既是source又是target
  * @param {string} param.dom - 可以把分组内的任意一个子dom作为自定义锚点
  */
addEndpoint = (obj) => {}
```

### group.getEndpoint (id)

*作用*： 节点组获取锚点的方法

*参数*

* `{string} pointId`锚点的信息 

*返回*

* `{Endpoint}`Endpoint的对象

```js
getEndpoint = (id) => {}
```

### group.moveTo (obj)

*作用*： 节点组移动坐标的方法

*参数*

* `{number} obj.x `移动位置的x坐标
* `{number} obj.y `移动位置的y坐标

```js
/**
  * @param {number} x - 移动位置的x坐标 
  * @param {number} y - 移动位置的y坐标 
  */
moveTo = (obj) => {}
```

### group.emit (event, data)

*作用*： 节点组发送事件的方法，画布及任何一个元素都可接收。

*参数*

* `{string} event `发送事件名称
* `{number} data `发送事件数据

```js
/**
  * 发送事件
  */
emit = (string, obj) => {}
```

*作用*： 节点组接收事件的方法，能接收画布及任何一个元素的事件。

*参数*

* `{string} event `接收事件名称
* `{function} data `接收事件回调

```js
on = (string, callback) => {}
```

