<template>
  <div id="app">
    <butterfly-vue
      :canvasData="mockData"
      @onCreateEdge="logCreateEdge"
      @onChangeEdges="logChangeEdges"
      @onDeleteEdge="logDeleteEdge"
      @onLoaded="finishLoaded"
      @onOtherEvent="logOtherEvent"
    />
    <el-button @click="add">add</el-button>
  </div>
</template>

<script>
import {ButterflyVue} from 'butterfly-vue';
import 'butterfly-vue/dist/index.css';
// import {ButterflyVue} from '../../../index.js';

// import {ButterflyVue} from '../../../dist/index.js';
// import '../../../dist/index.css';
// import {ButterflyVue} from '../../dist/index.js';
// import '../../dist/index.css';
import mockData from "../mockData";

export default {
  name: 'App',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      mockData,
      canvansRef:{},
      e: {},
    }
  },
  methods:{
    add() {
      // this.e.redraw();
      this.mockData.nodes.push({
        id: '4',
        top: 50,
        left: 300,
        render: `<div>测试节点4</div>`
      });
      console.log(1);
    },
    logCreateEdge(e) {
      console.log('---------CreateEdge---------');
      console.log(e);
      console.log(mockData);
      console.log(this.canvansRef.getDataMap());
      console.log('----------------');
    },
    logDeleteEdge(e) {
      console.log('---------DeleteEdge---------');
      console.log(e);
      console.log(mockData);
      console.log(this.canvansRef.getDataMap());
      console.log('----------------');
    },
    logChangeEdges(e) {
      console.log('---------ChangeEdges---------');
      console.log(e);
      console.log(mockData);
      console.log(this.canvansRef.getDataMap());
      console.log('----------------');
    },
    logOtherEvent(e) {
      // console.log(e);
    },
    finishLoaded(e) {
      this.e = e;
      this.canvansRef = e.canvas;
      console.log("finish");
    },
  }
}
</script>