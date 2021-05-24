<template>
  <div>
    <div class="control">
      <el-button @click="addNode">添加节点(node)</el-button>
    </div>
    <el-divider></el-divider>
    <butterfly-vue
      :canvasData="mockData"
      @onCreateEdge="logCreateEdge"
      @onChangeEdges="logChangeEdges"
      @onDeleteEdge="logDeleteEdge"
      @onOtherEvent="logOtherEvent"
      @onLoaded="finishLoaded"
      key="userEndpoint"
    />
  </div>
</template>

<script>

import {ButterflyVue} from '../../../../index.js';

import endpointNode from "./node/endpoint-node.vue";
import mockData from "./endpoint-mockData.js";

export default {
  name: 'User-Endpoint',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      mockData,
      canvansRef:{},
      butterflyVue: {},
      nodeIndex: 0,
    }
  },
  methods:{
    addNode() {
      this.mockData.nodes.push({
        id: `add${this.nodeIndex}`,
        left: 10 + this.nodeIndex * 290,
        top: 250,
        render: endpointNode,
        userData: {
          endpoints: ['1', '2', '3']
        }
      });
      this.nodeIndex++;
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
    finishLoaded(VueCom) {
      this.butterflyVue = VueCom;
      this.canvansRef = VueCom.canvas;
      console.log("finish");
    },
  }
}
</script>

<style scope>
  .control {
    padding-left: 10px;
  }
</style>
