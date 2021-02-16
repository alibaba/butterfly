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
    <el-button >add</el-button>
    <div id="aaa"></div>
  </div>
</template>

<script>
// import ButterflyVue from 'butterfly-vue';
// import 'butterfly-vue/index.css';
import ButterflyVue from './dist/index.unpkg';
// import './dist/index.css';
// import ButterflyVue from '../../dist/index.unpkg';
// import '../../dist/index.css';
// import ButterflyVue from "../../butterfly-vue.vue";
import "../../butterfly-vue.css";
import mockData from "./mockData";
import Vue from "vue";

export default {
  name: "App",
  components: {
    ButterflyVue,
  },
  data() {
    return {
      mockData,
    };
  },
  methods: {
    logEvent(e) {
      console.log(e);
    },
    finishLoaded(canvans) {
      console.log(canvans);
      console.log("finish");
    },
  },
  mounted() {
    var Profile = Vue.extend({
      template: "<el-button>{{firstName}} {{lastName}} aka {{alias}}</el-button>",
      data: function () {
        return {
          firstName: "Walter",
          lastName: "White",
          alias: "Heisenberg",
        };
      },
    });
    const dom = document.getElementById('aaa');

    console.log(dom);

    new Profile().$mount('#aaa');
  },
};
</script>