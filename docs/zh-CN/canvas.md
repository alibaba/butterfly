# 画布(Canvas)

```js
let canvas = new Canvas({
  root: dom,               //canvas的根节点(必传)
  layout: 'ForceLayout'    //布局设置(可传)，可使用集成的，也可自定义布局
  zoomable: true,          //可缩放(可传)
  moveable: true,          //可平移(可传)
  draggable: true,         //节点可拖动(可传)
  linkable: true,          //节点可连接(可传)
  disLinkable: true,       //节点可取消连接(可传)
  theme: {                 //主题定制(可传) 
    edge: {
      type: 'Bezier',      //线条默认类型：贝塞尔曲线，折线，直线，曼哈顿路由线，更美丽的贝塞尔曲线。分别为Bezier/Flow/Straight/Manhattan/AdvancedBezier
      label: 'test',       //线条默认label
      arrow: true,         //线条默认是否带箭头
      arrowPosition: 0.5,  //箭头位置(0 ~ 1)
      arrowOffset: 0.0,    //箭头偏移
      Class: XXClass,      //自己拓展的class,拖动连线的时候会采用该拓展类
      isExpandWidth: false //增加线条交互区域
    },
    endpoint: {
      position: []         //限制锚点位置['Top', 'Bottom', 'Left', 'Right'],
      linkableHighlight: true //连线时会触发point.linkable的方法，可做高亮
      expendArea: {        //锚点过小时，可扩大连线热区
        left: 10,
        right: 10,
        top: 10,
        botton: 10
      }
    },
    zoomGap: 0.001         //鼠标放大缩小间隙设置
  },
  global: {                //自定义配置，会贯穿所有canvas，group，node，edge，endpoint对象
    isScopeStrict: false   //scope是否为严格模式(默认为false)
  }
});
```

## 属性：

| key | 说明 | 类型 | 默认值 
| :------ | :------ | :------ | :------ 
| root | 渲染画布的跟节点 | Dom (Require) | `*这个dom必须设置position:relative`
| <a href='#layout'>layout</a> | 自动布局 | string/function (Option) | null 
| zoomable | 画布是否可缩放 | boolean (Option) | false 
| moveable | 画布是否可移动 | boolean (Option) | false 
| draggable | 画布节点是否可拖动 | boolean (Option) | false 
| linkable | 画布节点是否可连接 | boolean (Option) | false 
| disLinkable | 画布节点是否可取消连接 | boolean (Option) | false 
| theme | 画布主题 | object (Option) | undefined
| <a href="#global">global</a> | 全局属性 | object (Option) | undefined


### API：

```js
/**
  * 渲染方法
  * @param {data} data  - 里面包含分组，节点，连线
  * @param {function} callback  - `*渲染过程是异步的过程，需要的用户请留意回调`
  */
draw = (data, calllback) => {}

/**
  * 添加分组
  * @param {object|Group} object  - 分组的信息；Group － 分组的基类
  */
addGroup = (object|Group) => {}

/**
  * 根据id获取node
  * @param {string} id  - node id
  * @return {Node} - 节点对象
  */
getNode = (string) => {}

/**
  * 根据id获取group
  * @param {string} id  - group id
  * @return {Group} - 分组对象
  */
getGroup = (string) => {}

/**
  * 根据id获取相邻的edge
  * @param {string} id  - node id
  * @return {Edges} - 相邻的连线
  */
getNeighborEdges = (string) => {}

/**
  * 添加节点
  * @param {object|Node} object  - 节点的信息；Node － 节点的基类
  */
addNode = (object|Node) => {}

/**
  * 添加连线
  * @param {object|Edge} object  - 连线的信息；Edge － 连线的基类
  */
addEdge = (object|Edge) => {}

/**
  * 删除节点
  * @param nodeId string  - 节点id
  */
removeNode = (string) => {}

/**
  * 批量删除节点
  * @param nodeIds array  - 批量节点id
  */
removeNodes = (array) => {}

/**
  * 根据id删除节点组
  * @param {string} id  - node id
  * @return {Group} - 删除的对象
  */
removeGroup = (string) => {}

/**
  * 根据id或者Edge对象来删除线
  * @param {string or Edge} id or Edge  - 线的id或者Edge对象
  * @return {Edge} - 删除的线
  */
removeEdge = (param) => {}

/**
  * 根据id或者Edge对象来批量删除线
  * @param {array} string or Edge  - 线的id或者Edge对象的数组
  * @return {array} Edge - 删除的线
  */
removeEdges = (param) => {}

/**
  * 设置画布缩放
  * @param {true|false} boolean  - 是否支持画布缩放
  */
setZoomable = (boolean) => {}

/**
  * 设置画布平移
  * @param {true|false} boolean  - 是否支持画布平移
  */
setMoveable = (boolean) => {}

/**
  * 聚焦某个节点/节点组
  * @param {string/function} nodeId/groupId or filter  - 节点的id或者过滤器
  * @param {string} type  - 节点的类型(node or group)
  * @param {object} options {offset: [0,0]}  - 聚焦配置属性，如偏移值
  * @param {function} callback  - 聚焦后的回调
  */
focusNodeWithAnimate = (string, type, options, callback) => {}

/**
  * 聚焦某多个节点/节点组
  * @param {object} {nodes: [], groups: []}  - 节点和节点组的id数组
  * @param {array} type  - 节点的类型(node or group)
  * @param {object} options {offset: [0,0]}  - 聚焦配置属性，如偏移值
  * @param {function} callback  - 聚焦后的回调
  */
focusNodesWithAnimate = (objs, type, options, callback) => {}

/**
  * 聚焦整个画布，会自动调整画布位置和缩放
  * @param {object} options {offset: [0,0]}  - 聚焦配置属性，如偏移值
  * @param {function} callback  - 聚焦后的回调
  */
focusCenterWithAnimate = (options, callback) => {}

/**
  * 设置框选模式
  * @param {true|false} boolean  - 是否开启框选功能
  * @param {array} type - 可接受框选的内容(node/endpoint/edge,默认node)
  */
setSelectMode = (boolean, type) => {}

/**
  * 获取画布的缩放
  * @return {float} - 画布的缩放(0-1)
  */
getZoom = () => {}

/**
  * 获取画布的偏移值
  * @return {[x, y]} - 画布的偏移值
  */
getOffset = () => {}

/**
  * 获取画布的偏移值的中心点
  * @return {[x, y]} - 画布的偏移值的中心点(百分比)
  */
getOrigin = () => {}

/**
  * 获取画布的数据模型
  * @return {data} - 画布的数据
  */
getDataMap = () => {}

/**
  * 手动设置画布缩放的中心点
  * @param {[x, y]} array  - x,y的中心点坐标
  */
setOrigin = ([x ,y]) => {}

/**
  * 手动设置画布偏移
  * @param {[x, y]} array  - x,y坐标
  */
move = (postion) => {}

/**
  * 手动设置画布缩放
  * @param {scale} float  - 0-1之间的缩放值
  * @param {function} callback  - 缩放后的回调
  */
zoom = (postion) => {}

/**
  * 获取聚合组
  * @param {name} string  - 聚合组的名称
  */
getUnion = (name) => {}

/**
  * 获取所有聚合组
  */
getAllUnion = () => {}

/**
  * 添加聚合组 || 添加聚合组元素
  * @param {name} string  - 聚合组的名称
  * @param {obj} object  - 聚合组的元素
  */
add2Union = (name, obj) => {}

/**
  * 去除聚合组
  * @param {name} string  - 聚合组的名称
  */
removeUnion = (name) => {}

/**
  * 去除所有聚合组
  */
removeAllUnion = () => {}

/**
  * 发送事件
  */
emit = (string, obj) => {}

/**
  * 接受事件
  */
on = (string, callback) => {}

/**
  * 设置网格布局
  * @param {true|false} boolean  - 是否开启网格布局功能
  * @param {array} options - 网格布局的定制化参数
  */
setGirdMode = (show, options) => {}

/**
  * 把画布上的节点，节点组自动对齐(必须在网格布局下才生效)
  */
justifyCoordinate = () => {}


/**
  * 设置辅助线
  * @param {true|false} boolean  - 是否开启辅助线功能
  * @param {array} options - 辅助线的定制化参数
  */
setGuideLine = (show, options) => {}

/**
  * 设置缩略图
  * @param {true|false} boolean  - 是否开启辅助线功能
  * @param {Object} 具体请参考缩略图章节
  /
setMinimap = (show, options) => {}

/**
  * 屏幕转换为画布的坐标
  * @param {array[number]} coordinates - 需要换算的坐标([x,y])
  * @return {number} - 转换后的坐标
  */
terminal2canvas = (coordinates) => {}

/**
  * 画布转换为屏幕的坐标
  * @param {array[number]} coordinates - 需要换算的坐标([x,y])
  * @return {number} - 转换后的坐标
  */
canvas2terminal = (coordinates) => {}

/**
  * 画布保存为图片
  * @param {object=} options - 保存的图片参数，可选
  * @param {string=} options.type - 图片格式(png/jpeg/svg,默认png)，可选
  * @param {number=} options.quality - 图片质量(0~1，默认为1)，可选
  * @param {number=} options.width - 图片宽度(默认为画布宽度)，可选
  * @param {number=} options.height - 图片高度(默认为画布高度)，可选
  * @return {Promise}
  */
save2img = (options) => {}

/**
  * 当root移动或者大小发生变化时需要更新位置
  */
updateRootResize = () => {}

/**
  * 查找 N 层关联节点和边
  * @param {Object} options - 参数
  * @param {Node} options.node - 起始节点
  * @param {Endpoint} options.endpoint - 起始锚点，可选
  * @param {String} options.type - 查找方向，可选值为 all\in\out，默认all，可选
  * @param {Number} options.level - 层数，起始节点为第 0 层，默认 Infinity
  * @param {Function} options.iteratee - 是否继续遍历判定函数，返回 boolean 值
  * @returns {Object<nodes: Node, edges: Edge>} filteredGraph - 查找结果
  */
getNeighborNodesAndEdgesByLevel = (options) => {}

```


## 事件

```js
let canvas = new Canvas({...});
canvas.on('type', (data) => {
  //data 数据
});
```

| key | 说明 | 返回 
| :------ | :------ | :------
| system.canvas.click | 点击画布空白处 | -
| system.canvas.zoom | 画布缩放 | -
| system.node.delete | 删除节点 | -
| system.node.move | 移动节点 | -
| system.nodes.add | 批量节点添加 | -
| system.link.delete | 删除连线 | -
| system.link.connect | 连线成功 | -
| system.link.reconnect | 线段重连 | -
| system.link.click | 点击事件 | -
| system.group.delete | 删除节点组 | -
| system.group.move | 移动节点组 | -
| system.group.addMembers | 节点组添加节点 | -
| system.group.removeMembers | 节点组删除节点 | -
| system.multiple.select | 框选结果 | -
| system.drag.start | 拖动开始 | -
| system.drag.move | 拖动 | -
| system.drag.end | 拖动结束 | -


## 详细说明

### 属性说明

#### <a name='global'>global</a>
* **isScopeStrict**，用于设置全局scope严格模式
  * 默认为false。假如该值设置为true，当scope必须完全一致才能匹配；假如该值为false，当scope为undefined时，都能匹配所有值。

#### <a name='layout'>layout</a>
* **重力布局**，传入`'ForceLayout'`即可，小蝴蝶内置布局
* **自定义布局**，传入一个方法，里面可以按照用户需求进行布局。注:`除此之外，记得把Edge的calcPath的方法复写掉，不然会由小蝴蝶的内置计算线段的方法代替，无法实现所得的线段`

```js
let canvas = new Canvas({
  layout: (opts) => {
    // 画布长宽
    let width = opts.width;
    let height = opts. height;
    // 即将渲染的节点，节点组，以及线段数据
    let data = opts.data;
    // 布局逻辑，把节点，节点组的left和top值赋值即可
    ......
  }
})
```

### 方法说明

* **setGirdMode**，设置网格布局
  * `show`，设置是否开启网格布局
  * `options`，设置网格布局的参数，如下注释所示

```js
this.canvas.setGirdMode(true, {
  isAdsorb: false,         // 是否自动吸附,默认关闭
  theme: {
    shapeType: 'line',     // 展示的类型，支持line & circle
    gap: 23,               // 网格间隙
    adsorbGap: 8,          // 吸附间距
    backgroud: '#fff',     // 网格背景颜色
    lineColor: '#000',     // 网格线条颜色
    lineWidth: 1,          // 网格粗细
    circleRadiu: 1,        // 圆点半径
    circleColor: '#000'    // 圆点颜色
  }
});
```

* **setGuideLine**
  * `show`，设置是否开启辅助线
  * `options`，设置辅助线的参数，如下注释所示

```js
this.canvas.setGuideLine(true, {
  limit: 1,             // 限制辅助线条数
  theme: {
    lineColor: 'red',   // 网格线条颜色
    lineWidth: 1,       // 网格粗细
  }
});
```

* **add2Union**
  * `name`，聚合组名称。假如不存在，则添加聚合组；假如已存在，则添加聚合组元素
  * `object`，聚合组的元素

```js
this.canvas.add2Union('我的聚合组', {
  nodes: []     // Node对象或者nodeId
  groups: []    // Group对象或者groupId
  edges: []     // Edge对象或者edgeId
  endpoints: [] // Endpoint对象
});
```

* **canvas2terminal**，屏幕转换为画布的坐标
  * 如图所示，画布缩放，移动后的坐标和原来画布的坐标并不匹配，需要此方法来转换。特别注意：有拖动添加节点的用户们注意这两个`e.clientX`和`e.clientY`，需要调用此方法进行转换。
<img width="400" src="http://img.alicdn.com/tfs/TB1lWIAFHvpK1RjSZPiXXbmwXXa-973-850.jpg">

* **terminal2canvas**，画布转换为屏幕的坐标
  * `canvas2terminal`的逆转转换
 
* **save2img**，画布保存为图片
  * `options`，图片参数
  * `options.type`，图片类型
  * `options.quality`，图片质量
  * `options.width`，图片宽度
  * `options.height`，图片高度

```js
this.canvas.save2img({type: 'png', width: 1920, height: 1080, quality: 1})
  .then(dataUrl => {
    var link = document.createElement('a');
    link.download = 'XXX.png';
    link.href = dataUrl;
    link.click();
  });
```
