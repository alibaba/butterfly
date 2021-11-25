<template>
  <div>
    <div class="control">
      <el-button @click="addNode">添加节点(node)</el-button>
      <el-button @click="addGroup">添加组(group)</el-button>
      <el-button @click="updateGroup">修改组(group)</el-button>
      <el-button @click="redraw">重绘</el-button>
      <el-button @click="logData">log数据</el-button>
      <el-button @click="addEdge" :disabled="addEdgeEnable">添加连线1-4</el-button>
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
      @dblclick="lableEmit"
      key="base"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import {ButterflyVue} from '../../../../index.js';

import mockData from "./base-mockData.js";

import emergencyMockData from '../emergency/emergency-mockData.js';

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
      addEdgeEnable: false
    }
  },
  methods:{
    lableEmit(text) {
      console.log(text);
    },
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
    redraw() {
      this.mockData = {nodes:[], edges:[], groups:[]};
      this.$nextTick(() => {
        this.mockData = _.cloneDeep(emergencyMockData);
      })
    },
    logData() {
      console.log(mockData);
      console.log(this.canvansRef.getDataMap());
    },
    addEdge() {
      this.mockData.edges.push({
        id: '1.right-4.left',
        sourceNode: '1',
        targetNode: '4',
        source: 'right',
        target: 'left',
      })
      this.addEdgeEnable = true;
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
      // this.canvansRef.setGuideLine(true, {
      //   limit: 4,             // 限制辅助线条数
      //   adsorp: {
      //     enable: false,       // 开启吸附效果
      //     gap: 5              // 吸附间隔
      //   },
      //   theme: {
      //     lineColor: 'red',   // 网格线条颜色
      //     lineWidth: 1,       // 网格粗细
      //   }
      // });
      window.butterflyVue = VueCom;
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
