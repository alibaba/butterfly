<template>
  <div class="grid-node">
    {{itemData.label}}
  </div>
</template>

<script>

export default {
  name: "grid-node",

  props: {
    itemData: {
      type: Object,
    },
    canvasNode: {
      type: Object
    }
  },
  methods: {
  },
  created() {

  }
};
</script>

<style scoped>
  .grid-node {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid #aaa;
    color: #FFF;
    background-color: #F66902;
  }
</style>
