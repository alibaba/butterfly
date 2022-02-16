# butterfly-vue {ignore=true}

## Install {ignore=true}

Using npm:

``` bash
$ npm i butterfly-vue butterfly-dag -S
```

  - [Usage](#usage)
  - [Options](#options)
    - [canvasConf](#canvasconf)
    - [canvasData](#canvasdata)
    - [`canvasData.render` Render mode (two)](#canvasdatarender-render-mode-two)
      - [Object type (.vue) Recommended](#object-type-vue-recommended)
      - [String type（template）](#string-typetemplate)
  - [Function](#function)
  - [Custom Endpoint usage](#custom-endpoint-usage)

## Usage

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

## Options

|     Prop      | Type              | Description                                                                                                                        |                             | required |
| :-----------: | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | :-------------------------: | :------: |
|  canvasConf   | Object            | [see me](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-attr)                                        |     [see](#canvasConf)      |  false   |
|  baseCanvas   | Function          | [see me](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md)                                                    | Canvas from "butterfly-dag" |  false   |
|  canvasData   | Object            | [see](#canvasData)                                                                                                                 |                             |   true   |
|   className   | String            | Add on the outermost div(Replace the butterfly-vue)                                                                                |        butterfly-vue        |  false   |
| onChangeEdges | (data) => void;   | edge reconnect event(system.link.reconnect)                                                                                        |                             |  false   |
| onCreateEdge  | (data) => void;   | connect edge event(system.link.connect)                                                                                            |                             |  false   |
| onDeleteEdge  | (data) => void;   | delete edge event(system.links.delete)                                                                                             |                             |  false   |
| onOtherEvent  | (data) => void;   | [butterfly-dag event](https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/canvas.md#canvas-api-events) exclude above three |                             |  false   |
|   onLoaded    | (VueCom) => void; | Canvans onLoaded event(Return the instance of 'butterflyvue' (`VueCom.canvas` is the native `canvas`))                             |                             |  false   |

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

* `render`parameter will be described in detail later

``` js
let canvasData = {
  groups: [
    id: String; //require
    left: Number //require
    top: Number //require
    render: String|Object; //optional(If it is String type, it needs to follow template syntax)
    // (If it is Object type, it needs to follow .vue syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/group.md
  ],
  nodes: [
    id: String; //require
    render: String|Object; //optional(If it is String type, it needs to follow template syntax)
    // (If it is Object type, it needs to follow .vue syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/node.md#node-attr
  ],
  edges: [
    id: String; //require
    render: String|Object; //optional(If it is String type, it needs to follow template syntax)
    // (If it is Object type, it needs to follow .vue syntax)
    //Other Options see https://github.com/alibaba/butterfly/blob/master/docs/zh-CN/edge.md
  ]
}
```

### `canvasData.render` Render mode (two)

* Two mode`String|Object`

#### Object type (.vue) Recommended

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
    // Here you can get the data of the current node in mockdata
    itemData: {
      type: Object,
    },
    // Native node data (not recommended)
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

#### String type（template）

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
            render: `<div>testNode0</div>`,
          }
        ],
        edges: [],
      },
    }
  },
}
</script>
```

* Because the `String` type uses runtime compilation, the following configuration needs to be enabled

``` JS
//vue.config.js

module.exports = {
  runtimeCompiler: true
}
```

## Function

| Method | Description   | Parameters |
| :----: | ------------- | :--------: |
| redraw | Redraw canvas |    `-`     |

``` vue
<template>
  <div>
    <button @click="redraw">Redraw canvas</button>
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

## Custom Endpoint usage

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
