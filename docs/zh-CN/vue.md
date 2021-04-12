# Vue版小蝴蝶（butterfly-vue）

## 安装

``` bash
$ npm i butterfly-vue -S
```

## 用法

在 main.js 中写入以下内容：

``` js
import Vue from 'vue';
import ButterflyVue from 'butterfly-vue'
import 'butterfly-vue/butterfly-vue.css'
import App from './App.vue'

Vue.use(ButterflyVue);

new Vue({
    render: h => h(App),
}).$mount('#app')
```

mockData:

``` JS
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
        render: 
        `<div :style="{width:'250px',textAlign:'center',backgroundColor:'blanchedalmond'}" class='group-style'>测试group</div>`
    }],
    nodes: [{
            id: '1',
            group: '1',
            endpoints: endpoints,
            render: `<el-button type="primary">13215</el-button>`
            // 用element组件要先安装element-ui
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

组件中：

``` vue
<template>
  <div id="app">
    <butterfly-vue
      :canvasData="mockData"
      @onCreateEdge="aa"
      @onChangeEdges="aa"
      @onDeleteEdge="aa"
      @onLoaded="bb"
    />
  </div>
</template>

<script>
import mockData from "./data";

export default {
  name: 'App',
  components: {
  },
  data(){
    return{
      mockData
    }
  },
  methods:{
    aa(e) {
      console.log(e);
    },
    bb(canvans) {
      console.log(canvans);
      console.log("finish");
    },
  }
}
</script>
```

vue.config.js中：

``` JS
module.exports = {
    runtimeCompiler: true
}
```

## 属性

|      Prop     | 类型              | 说明                                                                                            |                  默认值                  | required |
|:-------------:|-------------------|-------------------------------------------------------------------------------------------------|:---------------------------------------:|:--------:|
|   canvasConf  | Object            | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr) |                  见下文                  |   false  |
|   baseCanvas  | Function          | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md)             | import { Canvas } from "butterfly-dag"; |   false  |
|   canvasData  | Object            | (见下文)                                                                                         |                                         |   true   |
|   className   | String            | 追加在最外层div上的class与butterfly-vue同级                                                        |                                         |   false  |
| onChangeEdges | (data) => void;   | 线改变触发                                                                                       |                                         |          |
|  onCreateEdge | (data) => void;   | 线创造触发                                                                                       |                                         |          |
|  onDeleteEdge | (data) => void;   | 线删除触发                                                                                       |                                         |          |
|    onLoaded   | (canvas) => void; | 画布加载完毕后返回画布实例                                                                          |                                         |          |

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

  // canvasData说明:
  let canvasData = {
    groups:[
      id: String;//必填
      left: Number//必填
      top: Number//必填
      render: String;//选填(符合vue的template规则)
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
    nodes:[
      id: String;//必填
      render: String;//选填(符合vue的template规则)
      //其他属性参考官网https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
      // render默认值
      // `
      // <div class="vue-bf-node">
      //   {{ id }}
      // </div>
      // `
    ],
    edges:[
      id: String;//必填
      render: String;//选填(符合vue的template规则)
      //其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
    ]
  }


```
