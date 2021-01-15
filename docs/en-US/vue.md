# butterfly-vue

## Install

Using npm:

``` bash
$ npm i butterfly-vue butterfly-dag -S
```

## Usage

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
    render: `<div :style="{width:'250px',textAlign:'center',backgroundColor:'blanchedalmond'}" class='group-style'>group</div>`
  }],
  nodes: [{
      id: '1',
      group: '1',
      endpoints: endpoints,
      render: `<el-button type="primary">node 1</el-button>`
      // can use any UI Library,<el-button>requires element-ui,
    },
    {
      id: '2',
      top: 25,
      left: 300,
      endpoints: endpoints,
      render: `<div>node 2</div>`
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
    render: '<div>label</div>'
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

## Options

|      Prop     | Type              | Description                                                                                                                       |                                         | required |
|:-------------:|-------------------|-----------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------:|:--------:|
|   canvasConf  | Object            | [see me](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr)                                       |            [see](#canvasConf)           |   false  |
|   baseCanvas  | Function          | [see me](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md)                                                   | import { Canvas } from "butterfly-dag"; |   false  |
|   canvasData  | Object            | [see](#canvasData)                                                                                                                |                                         |   true   |
|   className   | String            | Add on the outermost div(Same div as butterfly-vue)                                                                               |                                         |   false  |
| onChangeEdges | (data) => void; | edge reconnect event(system.link.reconnect)                                                                                       |                                         |   false  |
|  onCreateEdge | (data) => void; | connect edge event(system.link.connect)                                                                                           |                                         |   false  |
|  onDeleteEdge | (data) => void; | delete edge event(system.links.delete)                                                                                            |                                         |   false  |
|  onOtherEvent | (data) => void; | [butterfly-dag event](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-api-events) exlude above three |                                         |   false  |
|    onLoaded   | (canvas) => void; | Canvans onLoaded event                                                                                                            |                                         |   false  |

### canvasConf

``` js
  // canvasConf default:
  const defaultOptions = {
    disLinkable: true, // enable disConnect edges
    linkable: true, // enable connect edges
    draggable: true, // enable drag nodes
    zoomable: true, // enable zoom canvas
    moveable: true, // enable move canvas
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
let canvasData = {
  groups: [
    id: String; //require
    left: Number //require
    top: Number //require
    render: String; //optional(Follow template syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/group.md
    // render default
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
    id: String; //require
    render: String; //optional(Follow template syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
    // render default
    // `
    // <div class="vue-bf-node">
    //   {{ id }}
    // </div>
    // `
  ],
  edges: [
    id: String; //require
    render: String; //optional(Follow template syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
  ]
}
```
