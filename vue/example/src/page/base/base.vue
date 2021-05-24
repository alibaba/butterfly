<template>
  <div>
    <div class="control">
      <el-button @click="addNode">添加节点(node)</el-button>
      <el-button @click="addGroup">添加组(group)</el-button>
      <el-button @click="updateGroup">修改组(group)</el-button>
    </div>
    <el-divider></el-divider>
    <butterfly-vue
      :canvasData="mockData"
      :canvasConf="canvasConfig"
      @onCreateEdge="logCreateEdge"
      @onChangeEdges="logChangeEdges"
      @onDeleteEdge="logDeleteEdge"
      @onOtherEvent="logOtherEvent"
      @onLoaded="finishLoaded"
      key="base"
    />
  </div>
</template>

<script>

import {ButterflyVue} from '../../../../index.js';

import mockData from "./base-mockData.js";

export default {
  name: 'Base',
  components: {
    ButterflyVue,
  },
  data(){
    return{
      mockData,
      canvansRef:{},
      butterflyVue: {},
      nodeIndex: 0,
      groupIndex: 0,
      update: 0,
      canvasConfig:{
        disLinkable: true, // 可删除连线
        linkable: true,    // 可连线
        draggable: true,   // 可拖动
        zoomable: true,    // 可放大
        moveable: true,    // 可平移
        theme: {
          edge: {
            shapeType: 'Flow'
          }
        }
      },
    }
  },
  methods:{
    addNode() {
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
      this.mockData.nodes.push({
        id: `add${this.nodeIndex}`,
        left: 10 + this.nodeIndex * 120,
        top: 250,
        endpoints: endpoints,
      });
      this.nodeIndex++;
    },
    addGroup() {
      this.mockData.groups.push({
        id: `add${this.groupIndex}`,
        left: 10 + this.groupIndex * 290,
        top: 300,
      });
      this.groupIndex++;
    },
    updateGroup() {
      this.mockData.groups[2].userData.name = `updateName${this.update}`
      this.update++;
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
      console.log(VueCom);
    },
  }
}
</script>

<style scope>
 .control {
   padding-left: 10px;
 }
</style>
