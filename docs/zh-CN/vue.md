# Vue版小蝴蝶（butterfly-vue） {ignore=true}

## 安装 {ignore=true}

``` bash
$ npm i butterfly-vue butterfly-dag -S
```

  - [用法](#用法)
  - [属性](#属性)
    - [canvasConf](#canvasconf)
    - [canvasData](#canvasdata)
    - [`canvasData.render`渲染方式（两种）](#canvasdatarender渲染方式两种)
      - [Object类型（.vue文件）推荐使用](#object类型vue文件推荐使用)
      - [String类型（template）](#string类型template)
  - [方法](#方法)
  - [自定义锚点使用](#自定义锚点使用)

## 用法

``` JS
//mockData.js
const endpoints = [
  {
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
  groups: [
    {
      id: '1',
      left: 10,
      top: 20,
    },
  ],
  nodes: [
    {
      id: '1',
      group: '1',
      top: 40,
      left: 20,
      endpoints: endpoints,
    },
    {
      id: '2',
      top: 50,
      left: 300,
      endpoints: endpoints,
    },
  ],
  edges: [{
    id: '1-2',
    sourceNode: '1',
    targetNode: '2',
    source: 'right',
    target: 'left',
  }],
};
```

``` vue
// component.vue

<template>
  <div id="app">
    <butterfly-vue
      :canvasData="mockData"
    />
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';
import mockData from "./mockData.js";

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
}
</script>
```

## 属性

|     Prop      | 类型              | 说明                                                                                                                      |                 默认值                  | required |
| :-----------: | ----------------- | ------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------: | :------: |
|  canvasConf   | Object            | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr)                         |          [见下文](#canvasConf)          |  false   |
|  baseCanvas   | Function          | 参考官网[定义](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md)                                     | import { Canvas } from "butterfly-dag"; |  false   |
|  canvasData   | Object            | [见下文](#canvasData)                                                                                                     |                                         |   true   |
|   className   | String            | 追加在最外层`div`上的`class`直接替换掉`butterfly-vue`样式                                                                 |             `butterfly-vue`             |  false   |
| onChangeEdges | (data) => void;   | 线改变触发(system.link.reconnect)                                                                                         |                                         |  false   |
| onCreateEdge  | (data) => void;   | 线创造触发(system.link.connect)                                                                                           |                                         |  false   |
| onDeleteEdge  | (data) => void;   | 线删除触发(system.links.delete)                                                                                           |                                         |  false   |
| onOtherEvent  | (data) => void;   | [butterfly-dag中api](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-api-events) 中除上述3种 |                                         |  false   |
|   onLoaded    | (VueCom) => void; | 画布加载完毕后返回`ButterflyVue`实例（VueCom.canvas就是原生的canvas）                                                     |                                         |  false   |

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

* `render`参数后文会详细说明

``` js
  // canvasData说明:
  let canvasData = {
    groups: [
      id: String; //必填
      left: Number //必填
      top: Number //必填
      render: String|Object; //选填(若为Sring类型需要符合vue的template规则)
      //(若为Object类型需要符合.vue文件编译后的类型，此处即为直接传入.vue文件）
      //其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/group.md
    ],
    nodes: [
      id: String; //必填
      render: String|Object; //选填(若为Sring类型需要符合vue的template规则)
      //(若为Object类型需要符合.vue文件编译后的类型，此处即为直接传入.vue文件）
      //其他属性参考官网https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
    ],
    edges: [
      id: String; //必填
      render: String|Object; //选填(若为Sring类型需要符合vue的template规则)
      //(若为Object类型需要符合.vue文件编译后的类型，此处即为直接传入.vue文件）
      //其他属性参考官方https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
    ]
  }
```

### `canvasData.render`渲染方式（两种）

* 两种类型：`String|Object`

#### Object类型（.vue文件）推荐使用

``` vue
// grid-node.vue
<template>
  <div class="grid-node">
    {{itemData.label}}
  </div>
</template>

<script>

export default {
  name: "grid-node",

  props: {
    // 这里可以拿到mockdata里的当前节点的数据
    itemData: {
      type: Object,
    },
    // 原生的节点数据（不推荐使用这个）
    canvasNode: {
      type: Object
    }
  },
  methods: {
  },
  created() {

  }
};
</script>

<style scoped>
  .grid-node {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid #aaa;
    color: #FFF;
    background-color: #F66902;
  }

</style>
```

``` vue
// component.js

<template>
  <div id="app">
    <butterfly-vue
      :canvasData="graphData"
    />
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';

import gridNode from './node/drag-node.vue';

export default {
  name: 'App',
  components: {
    ButterflyVue
  },
  data(){
    return{
      graphData: {
        groups: [],
        nodes: [
          {
            id: '0',
            left: 10,
            top: 10,
            label: '0',
            render: gridNode,
          }
        ],
        edges: [],
      },
    }
  },
}
</script>
```

#### String类型（template）

``` vue
// component.js

<template>
  <div id="app">
    <butterfly-vue
      :canvasData="graphData"
    />
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';

export default {
  name: 'App',
  components: {
    ButterflyVue
  },
  data(){
    return{
      graphData: {
        groups: [],
        nodes: [
          {
            id: '0',
            left: 10,
            top: 10,
            render: `<div>测试节点0</div>`,
          }
        ],
        edges: [],
      },
    }
  },
}
</script>
```

* 因为`String`类型使用了运行时编译，所以需要启用以下配置

``` JS
//vue.config.js

module.exports = {
  runtimeCompiler: true
}
```

## 方法

| 方法名 | 说明         | 参数  |
| :----: | ------------ | :---: |
| redraw | 重新绘制画布 |  `-`  |

``` vue
<template>
  <div>
    <button @click="redraw">重绘画布</button>
    <butterfly-vue
      ref="butterflyVue"
    />
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';

export default {
  name: 'Drag',
  components: {
    ButterflyVue,
  },
  methods:{
    redraw() {
      this.$refs.butterflyVue.redraw();
    },
  }
}
</script>

```

## 自定义锚点使用

``` vue
// endpoint-node.vue
<template>
  <div class="endpoint-node">
    <butterfly-vue-endpoint id="1" :param="{scope:'endpoint-1', limitNum: 2}"/>
    <butterfly-vue-endpoint id="2" className="endpoint-2">
      content
    </butterfly-vue-endpoint>
  </div>
</template>

<script>

import {ButterflyVueEndpoint} from 'butterfly-vue';

export default {
  name: "endpoint-node",
  components: {
    ButterflyVueEndpoint
  },
};
</script>

<style scoped>
  .endpoint-node {
    width: 200px;
    height: 100px;
    border-radius: 5px;
    border: 1px solid #aaa;
    padding: 10px;
    box-shadow: 3px 4px 16px #888888;
  }

  .endpoint-node .endpoint-2 {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
</style>
```

``` vue
// component.vue
<template>
  <div>
    <butterfly-vue :canvasData="graphData" />
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';
import 'butterfly-vue/dist/index.css';

import endpointNode from "./endpoint-node.vue";

export default {
  name: 'User-Endpoint',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      graphData: {
        groups: [],
        nodes: [
          {
            id: '0',
            left: 10,
            top: 10,
            render: endpointNode,
          }
        ],
        edges: [],
      },
    }
  },
}
</script>
```

| Prop      | 类型   | 说明                     | 默认值                  | required |
| --------- | ------ | ------------------------ | ----------------------- | -------- |
| id        | String | 自定义endpoint的唯一标示 |                         | true     |
| className | String | 自定义endpoint的样式     | vue-bf-endpoint-default | false    |
| param     | Object | endponit的其他参数       |                         | false    |

[param属性参考地址](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/endpoint.md#%E5%B1%9E%E6%80%A7)
