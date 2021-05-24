<template>
  <div class="vue-bf-node">
    node{{itemData.id}}
  </div>
</template>

<script>

export default {
  name: "vue-node",
  props: {
    itemData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
  .vue-bf-node {
    width: 100px;
    height: 25px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid #aaa;
    text-align: center;
  }
</style>
