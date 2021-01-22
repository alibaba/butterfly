# Vue版小蝴蝶（butterfly-vue）

## 安装

``` bash
$ npm i butterfly-vue butterfly-dag -S
```

## 用法

``` JS
//mockData.js

const endpoints = [{
    id: 'right',
    orientation: [1, 0],
    pos: [0, 0.5]
  },
  {
    id: 'left',
    orientation: [-1, 0],
    pos: [0, 0.5]
  }
];

export default {
  groups: [{
    id: '1',
    left: 10,
    top: 100,
    render: `<div :style="{width:'250px',textAlign:'center',backgroundColor:'blanchedalmond'}" class='group-style'>测试group</div>`
  }],
  nodes: [{
      id: '1',
      group: '1',
      endpoints: endpoints,
      render: `<el-button type="primary">节点1</el-button>`
      // 可以用任何Ui库（安装即可）,用element组件要先安装element-ui
    },
    {
      id: '2',
      top: 25,
      left: 300,
      endpoints: endpoints,
      render: `<div>测试节点2</div>`
    },
    {
      id: '3',
      top: 25,
      left: 600,
      endpoints: endpoints,
    }
  ],
  edges: [{
    id: '1-2',
    sourceNode: '1',
    targetNode: '2',
    source: 'right',
    target: 'left',
    render: '<div>测试label</div>'
  }],
};
```

``` vue
// component.js

<template>
  <div id="app">
    <butterfly-vue
      :canvasData="mockData"
      @onCreateEdge="logEvent"
      @onChangeEdges="logEvent"
      @onDeleteEdge="logEvent"
      @onOtherEvent="logEvent"
      @onLoaded="finishLoaded"
    />
  </div>
</template>

<script>
import ButterflyVue from 'butterfly-vue';
import 'butterfly-vue/index.css';
import mockData from "./mockData";

export default {
  name: 'App',
  components: {
    ButterflyVue
  },
  data(){
    return{
      mockData
    }
  },
  methods:{
    logEvent(e) {
      console.log(e);
    },
    finishLoaded(canvans) {
      console.log(canvans);
      console.log("finish");
    },
  }
}
</script>
```

``` JS
//vue.config.js

module.exports = {
  runtimeCompiler: true
}
```

## 属性

|      Prop     | 类型              | 说明                                                                                                                    |                  默认值                  | required |
|:-------------:|-------------------|-------------------------------------------------------------------------------------------------------------------------|:---------------------------------------:|:--------:|
|   canvasConf  | Object            | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr)                         |           [见下文](#canvasConf)          |   false  |
|   baseCanvas  | Function          | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md)                                     | import { Canvas } from "butterfly-dag"; |   false  |
|   canvasData  | Object            | [见下文](#canvasData)                                                                                                    |                                         |   true   |
|   className   | String            | 追加在最外层div上的class与butterfly-vue同级                                                                                |                                         |   false  |
| onChangeEdges | (data) => void; | 线改变触发(system.link.reconnect)                                                                                        |                                         |   false  |
|  onCreateEdge | (data) => void; | 线创造触发(system.link.connect)                                                                                          |                                         |   false  |
|  onDeleteEdge | (data) => void; | 线删除触发(system.links.delete)                                                                                          |                                         |   false  |
|  onOtherEvent | (data) => void; | [butterfly-dag中api](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-api-events) 中除上述3种 |                                         |   false  |
|    onLoaded   | (canvas) => void; | 画布加载完毕后返回画布实例                                                                                                  |                                         |   false  |

### canvasConf

``` js
  // canvasConf默认值：
  const defaultOptions = {
    disLinkable: true, // 可删除连线
    linkable: true, // 可连线
    draggable: true, // 可拖动
    zoomable: true, // 可放大
    moveable: true, // 可平移
    theme: {
      edge: {
        arrow: true,
        type: 'Straight',
      }
    }
  };
```

### canvasData

``` js
  // canvasData说明:
  let canvasData = {
    groups: [
      id: String; //必填
      left: Number //必填
      top: Number //必填
      render: String; //选填(符合vue的template规则)
      //其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/group.md
      // render默认值
      // `
      // <div class="vue-bf-group">
      // <div class="vue-bf-group-header">
      //     {{ id }}
      //   </div>
      //   <div class="vue-bf-group-content"></div> 
      // </div>
      // `
    ],
    nodes: [
      id: String; //必填
      render: String; //选填(符合vue的template规则)
      //其他属性参考官网https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
      // render默认值
      // `
      // <div class="vue-bf-node">
      //   {{ id }}
      // </div>
      // `
    ],
    edges: [
      id: String; //必填
      render: String; //选填(符合vue的template规则)
      //其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
    ]
  }
```
