# butterfly-plugins-layout

小蝴蝶布局插件,用于将数据转换为可以直接被渲染的小蝴蝶类。

## 插件布局本地DEMO
``` shell
cd example
npm install
npm start
```
## 快速上手
### graphviz layout
``` js
import {graphvizLayout} from 'butterfly-plugins-layout';

// ···

// 可以在画布初始化的时候传入layout参数作为布局方法
let canvas = new Canvas({
  // 如下属性
  root: dom,               //canvas的根节点(必传)
  layout: graphvizLayout,   //布局设置(选填)，可使用集成的，也可自定义布局
  zoomable: true,          //可缩放(选填)
  moveable: true,          //可平移(选填)
  draggable: true,         //节点可拖动(选填)
  linkable: true,          //节点可连接(选填)
  disLinkable: true,       //节点可取消连接(选填)
});

// 也可以在画布数据导入完成后手动调用这个方法
// ...
graphvizLayout({
  data: {nodes, edges}
});

// ···

```

也可以使用部分引入减小包体积大小:
``` js
import graphvizLayout, {GraphvizEdge} from 'butterfly-plugins-layout/graphvizLayout';
```

### kedroviz layout
``` js
import {kedrovizLayout, KedrovizEdge, BaseLayers, obstacleAvoidancePoints} from 'butterfly-plugins-layout';

// ···

// 可以在画布初始化的时候传入layout参数作为布局方法
let canvas = new Canvas({
  // 如下属性
  root: dom,               //canvas的根节点(必传)
  layout: {
    type: kedrovizLayout, 
    options: {rankdir: 'TB', visible: true, Class: BaseLayers}
  },                       //布局设置(选填)，可使用集成的，也可自定义布局
  zoomable: true,          //可缩放(选填)
  moveable: true,          //可平移(选填)
  draggable: true,         //节点可拖动(选填)
  linkable: true,          //节点可连接(选填)
  disLinkable: true,       //节点可取消连接(选填)
  avoidPoints: obstacleAvoidancePoints //避障贝塞尔曲线
});

this.canvas.draw({nodes, edges, layers}, () => {

});
// ···

```

## 布局算法

### graphviz layout

基于d3-graphviz排布的节点布局算法，传入数据后直接返回可以用于在小蝴蝶中渲染的node和edge数组。

注：使用这个布局方法，Edge需要继承由graphvizLayout导出的GraphvizEdge类（这个类已经继承了Butterfly的Edge），并且不覆盖其calcPath方法，否则可能会导致边绘制不正确的问题。

#### 属性

属性遵循graphviz提供的dot语言，可直接传入在dot语言中的dot布局定义的属性来使得布局定制化。

##### nodesep _`<Double>`_   (选填)

&nbsp;&nbsp;节点布局同一等级节点的最小间隔；值类型 `double`，默认0.25，最小0.02

##### rankdir _`<String>`_   (选填)

&nbsp;&nbsp;布局方向，可选值为'TB','BT','LR','RL'；值类型 `string`，默认 `TB`

##### ranksep _`<Double>`_   (选填)

&nbsp;&nbsp;节点布局不同等级之间的间隔；值类型 `double`，默认0.5，最小0.02

### kedroviz layout
&nbsp;&nbsp;&nbsp;&nbsp;Kedroviz layout适合节点分组的布局算法。其根据图数据中节点所属组（layer），自动计算节点的层级及位置。

注：使用这个布局方法，Edge需要继承由kedrovizLayout导出的KedrovizEdge类。Layers需要继承由kedrovizLayout导出的BaseLayers类。

#### 代码演示

``` js
this.canvas = new Canvas({
  layout: {
    type: kedrovizLayout,
    options: {
      rankdir: 'TB',
      visible: true,
      Class: BaseLayers
    },
  },
  avoidPoints: obstacleAvoidancePoints
});
```

#### API


| 名称 | 类型 | 是否必须 | 默认值 | 可选值 | 说明  
| :------ | :------ | :------ | :------ | :------ | :------
| rankdir | String | false | TB| "TB/BT/LR/RL"  |布局的方向。T：top（上）；B：bottom（下）；L：left（左）；R：right（右）。
| visible | Boolean | false | true | true / false | 节点是否显示分组
| Class | Function | true |  | BaseLayers | 分组（layers）的类

### 避障贝塞尔曲线
&nbsp;&nbsp;&nbsp;&nbsp;避障贝塞尔曲线在节点连线时会自动避开中间节点。

注：使用该曲线时，Edge需要继承KedrovizEdge类。需要在Canvas中传入avoidPoints参数

#### 代码演示

``` js

import {KedrovizEdge, obstacleAvoidancePoints} from 'butterfly-plugins-layout';

this.canvas = new Canvas({
  avoidPoints: obstacleAvoidancePoints
});

```

#### API

| 名称 | 类型 | 是否必须 | 默认值 | 可选值 | 说明  
| :------ | :------ | :------ | :------ | :------ | :------
| avoidPoints | Function | 是 | | obstacleAvoidancePoints | 计算避障节点的方法
