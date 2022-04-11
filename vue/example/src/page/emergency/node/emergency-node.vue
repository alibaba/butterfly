<template>
  <div class="emergency-node" :style="`width:${itemData.userData.width}px`">
    {{itemData.userData.content}}
  </div>
</template>

<script>

export default {
  name: "emergency-node",

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
  .emergency-node {
    width: 140px;
    height: 30px;
    border-radius: 80px;
    border: 1px solid #aaa;
    text-align: center;
    overflow: hidden;
    line-height: 28px;
    font-size: 12px;
  }

</style>
