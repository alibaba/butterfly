<template>
  <el-container>
    <el-aside width="200px">
      <div draggable class="node-container" @dragstart="(e)=>{dragstart(e,user1)}" ref="user1">
        <dragNode :itemData="user1"/>
      </div>
      <div draggable class="node-container" @dragstart="(e)=>{dragstart(e,user2)}" ref="user2">
        <dragNode :itemData="user2"/>
      </div>
      <div draggable class="node-container" @dragstart="(e)=>{dragstart(e,user3)}" ref="user3">
        <dragNode :itemData="user3"/>
      </div>
    </el-aside>
    <el-main>
      <div @dragover="dragover" @drop="addNode">
        <butterfly-vue
          className="drag"
          :canvasData="mockData"
          @onLoaded="finishLoaded"
          key="drag"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
// import {ButterflyVue} from 'butterfly-vue';

import dragNode from './node/drag-node.vue';

import {ButterflyVue} from '../../../../index.js';

export default {
  name: 'Drag',
  components: {
    ButterflyVue,
    dragNode
  },
  data(){
    return{
      user1: {
        ref: 'user1',
        userData: {
          title: '申请人',
          input: '',
          modify: 1,
          reader: 5,
        }
      },
      user2: {
        ref: 'user2',
        userData: {
          title: '审批人',
          input: '',
          modify: 1,
          reader: 5,
        }
      },
      user3: {
        ref: 'user3',
        userData: {
          title: '验收人',
          input: '',
          modify: 1,
          reader: 5,
        }
      },
      mockData: {
        nodes: [
          {
            id: '1',
            left: 10,
            top: 10,
            render: dragNode,
            endpoints: [
              {
                id: 'left',
                orientation: [-1, 0],
                pos: [0, 0.5]
              }, 
              {
                id: 'right',
                orientation: [1, 0],
                pos: [0, 0.5]
              }
            ],
            userData: {
              title: '申请人',
              input: '',
              modify: 12,
              reader: 5,
            }
          }
        ],
        groups: [],
        edges: []
      },
      canvansRef:{},
      butterflyVue: {},
    }
  },
  methods:{
    guid() {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return  (S4()+S4()+ "-" +S4());
    },
    dragstart(e,user) {
      e.dataTransfer.setData('user',JSON.stringify(user));
      e.dataTransfer.setDragImage(this.$refs[user.ref],0,0);
    },
    dragover(e) {
      e.preventDefault();
    },
    addNode(e) {
      const endpointLeft = {
        id: 'left',
        orientation: [-1, 0],
        pos: [0, 0.5]
      };
      const endpointRight = {
        id: 'right',
        orientation: [1, 0],
        pos: [0, 0.5]
      };
      let {clientX, clientY} = e;
      let coordinates = this.canvansRef.terminal2canvas([clientX, clientY]);
      let user = JSON.parse(e.dataTransfer.getData('user'));
      this.mockData.nodes.push({
        id: this.guid(),
        left: coordinates[0],
        top: coordinates[1],
        render: dragNode,
        userData: user.userData,
        endpoints: [
          endpointLeft,
          endpointRight
        ]
      });
    },
    finishLoaded(VueCom) {
      this.butterflyVue = VueCom;
      this.canvansRef = VueCom.canvas;
      window.butterflyVue = VueCom;
      this.canvansRef.setMinimap(true, {
        height: 100,
        nodeColor: "rgb(234,217,162)",
        activeNodeColor: "rgb(234,162,176)",
      });
      console.log("finish");
    },
  }
}
</script>

<style scope>
  .drag {
    height: 700px;
    min-width: 500px;
    width: 100%;
    display: block;
    position: relative;
  }
  .el-main {
    padding: 0;
  }
  .node-container {
    width: 100%;
  }
  .drag {
    height: 700px;
    min-width: 500px;
    width: 100%;
    display: block;
    position: relative;
  }
</style>
