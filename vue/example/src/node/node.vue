<template>
  <div @click="bbb">
    <butterfly-vue-endpoint id="1"></butterfly-vue-endpoint>
    <button @click="aaa">node</button>
    <div>
      <butterfly-vue-endpoint id="2"></butterfly-vue-endpoint>
    </div>
    <butterfly-vue-endpoint id="3"></butterfly-vue-endpoint>
  </div>
</template>

<script>

// import {ButterflyVueEndpoint} from 'butterfly-vue';
import {ButterflyVueEndpoint} from '../../../index.js';

export default {
  name: "nodeTest",
  components: {
    ButterflyVueEndpoint
  },
  props: {
    nodeData: {
      type: Object,
      required: true,
    },
  },
  methods: {
    bbb() {
      console.log('bbb');
    },
    aaa(e) {
      console.log('aaa');
      e.stopPropagation();
    }
  },
  mounted(){
    // console.log(this.nodeData);
  }
};
</script>