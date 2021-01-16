<template>
  <div ref="nodeContent"></div>
</template>

<script>
import {defaultNode} from "../util/default-data"
import Vue from 'vue'

export default {
  name: "Vue-node",
  props: {
    id: {
      type: String,
      required: true,
    },
    render: {
      type: String,
      default: defaultNode
    },
  },
  methods:{
    renderDom(){
      const Com = Vue.extend({
        template: `${this.render}`,
        props:{
          id: {
            type: String,
            required: true,
          }
        },
        methods:{},
        created(){}
      })

      const nodeCom = new Com({propsData: {id : this.id} }).$mount();
      this.$refs['nodeContent'].appendChild(nodeCom.$el)
    }
  },
  mounted(){
    this.renderDom();
  }
};
</script>

<style>

</style>