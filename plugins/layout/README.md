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
const data = require('./mockdata.json');

// ···

// convertData中含有可以直接渲染的nodes和edges
const convertData = graphvizLayout(data);
this.canvas.draw(convertData);

// ···

```

## 布局算法

### graphviz layout

基于d3-graphviz排布的节点布局算法，传入数据后直接返回可以用于在小蝴蝶中渲染的node和edge数组。

#### 数据格式