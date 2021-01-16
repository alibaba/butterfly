<template>
  <div ref="groupContent"></div>
</template>

<script>
import {defaultGroup} from "../util/default-data"
import Vue from 'vue'

export default {
  name: "Vue-group",
  props: {
    id: {
      type: String,
      required: true,
    },
    render: {
      type: String,
      default: defaultGroup
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

      const groupCom = new Com({propsData: {id : this.id} }).$mount();
      this.$refs['groupContent'].appendChild(groupCom.$el);
    }
  },
  mounted(){
    this.renderDom();
  }
};
</script>

<style>

</style>