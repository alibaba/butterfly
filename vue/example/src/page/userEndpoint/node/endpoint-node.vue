<template>
  <div class="endpoint-node">
    <butterfly-vue-endpoint id="1" v-if="judge('1')" :param="{scope:'endpoint-1', limitNum: 2}"/>
    <butterfly-vue-endpoint id="2" className="endpoint-2" v-if="judge('2')"/>
    <butterfly-vue-endpoint id="3" className="endpoint-3" v-if="judge('3')">
      <el-tag>endpoint</el-tag>
    </butterfly-vue-endpoint>
    <el-row v-if="judge('4')">
      <butterfly-vue-endpoint id="4" className="endpoint-4">
        <el-tag>endpoint</el-tag>
      </butterfly-vue-endpoint>
    </el-row>
    <v-card max-width="344" v-if="judge('5')">
      <butterfly-vue-endpoint id="5" className="endpoint-5" :param="{scope:'endpoint-1', limitNum: 3}" >
        content
      </butterfly-vue-endpoint>
    </v-card>
  </div>
</template>

<script>

import {ButterflyVueEndpoint} from '../../../../../index.js';

export default {
  name: "endpoint-node",
  components: {
    ButterflyVueEndpoint
  },
  props: {
    itemData: {
      type: Object,
    },
    canvasNode: {
      type: Object
    }
  },
  methods: {
    judge(id){
      return this.itemData.userData.endpoints.includes(id)
    }
  },
  created() {
    // console.log(this.canvasNode);
  }
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
    background-color: #828f9c;
    width: 22px;
    height: 22px;
    border: 1px solid #aaa;
    border-radius: 5px;
    text-align: center;
  }

  .endpoint-node .endpoint-3 {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .endpoint-node .endpoint-4 {
    position: relative;
    display: inline-block;
  }

  .endpoint-node .endpoint-5 {
    position: relative;
    display: inline-block;
  }
</style>
