<template>
  <div id="app">
    <butterfly-vue
      :canvasData="mockData"
      @onCreateEdge="logEvent"
      @onChangeEdges="logEvent"
      @onDeleteEdge="logEvent"
      @onOtherEvent="logEvent"
      @onLoaded="finishLoaded"
    />
    <el-button>add</el-button>
  </div>
</template>

<script>
import ButterflyVue from 'butterfly-vue';
import 'butterfly-vue/index.css';
import mockData from "./mockData";

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
  methods:{
    logEvent(e) {
      console.log(e);
    },
    finishLoaded(canvans) {
      console.log(canvans);
      console.log("finish");
    },
  }
}
</script>