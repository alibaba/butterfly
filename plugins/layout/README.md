# butterfly-plugins-layout

小蝴蝶布局插件,用于将数据转换为可以直接被渲染的小蝴蝶类。

## 插件布局本地DEMO
``` shell
cd example
npm install
npm start
```
## 快速上手
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

## 布局算法

### graphviz layout

基于d3-graphviz排布的节点布局算法，传入数据后直接返回可以用于在小蝴蝶中渲染的node和edge数组。

注：使用这个布局方法，Edge需要继承由graphvizLayout导出的GraphvizEdge类（这个类已经继承了Butterfly的Edge），并且不覆盖其calcPath方法，否则可能会导致边绘制不正确的问题。

#### 属性

属性遵循graphviz提供的dot语言，可直接传入在dot语言中的dot布局定义的属性来使得布局定制化。

##### rankdir _`<String>`_   (选填)

&nbsp;&nbsp;布局方向，可选值为'TB','BT','LR','RL'；值类型 `string`，默认 `TB`