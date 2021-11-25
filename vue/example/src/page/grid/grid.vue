<template>
  <div>
    <div class="control">
      <el-button @click="addEdge">添加连线0-29</el-button>
    </div>
    <div>
      <butterfly-vue
        :canvasData="mockData"
        :canvasConf="canvasConfig"
        @onLoaded="finishLoaded"
        className='grid'
        key="grid"
      />
    </div>
  </div>
</template>

<script>

import {ButterflyVue} from '../../../../index.js';

import mockData from "./grid-mockData.js";

export default {
  name: 'Grid',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      mockData,
      canvasConfig:{
        disLinkable: true, // 可删除连线
        linkable: false,    // 可连线
        draggable: true,   // 可拖动
        zoomable: true,    // 可放大
        moveable: true,    // 可平移
        layout: {
          type: 'gridLayout',
          options: {
            link: {
              // 线条的距离
              distance: 50,
              // 线条的粗细
              strength: 1
            },
            // 布局画布总宽度
            width: 150,
            // 布局画布总长度
            height: 100,
            // 布局相对起始点
            begin: [20, 20],
            center: [10,100],
            preventOverlap: true,
            preventOverlapPadding: 10,
            condense: false,
            //宽高
            rows: undefined,
            cols: undefined,
            //位置
            position: undefined,
            // 排序方式
            sortBy: 'degree',
            nodeSize: 30,
          },
        },
      },
      canvansRef:{},
      butterflyVue: {},
      nodeIndex: 0,
    }
  },
  methods:{
    addEdge() {
      this.mockData.edges.push({
        id: '0-29',
        type: 'node',
        source: '0',
        target: '29',
      })
    },
    finishLoaded(VueCom) {
      this.butterflyVue = VueCom;
      this.canvansRef = VueCom.canvas;
      console.log("finish");
    },
  }
}
</script>

<style>
  .control {
    padding-left: 10px;
  }
  .grid {
    height: 700px;
    min-width: 500px;
    width: 100%;
    display: block;
    position: relative;
  }
</style>
