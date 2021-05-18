<template>
  <div class="vue-bf-group">
    <div class="vue-bf-group-header">
      group{{itemData.id}}
    </div>
    <div class="vue-bf-group-content"></div> 
  </div>
</template>

<script>

export default {
  name: "vue-group",
  props: {
    itemData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
  .vue-bf-group {
    border-radius: 5px;
    min-width: 250px;
    border: 1px solid #aaa;
  }

  .vue-bf-group .vue-bf-group-header {
    height: 30px;
    background-color: #aaa;
    text-align: center;
    line-height: 30px;
  }

  .vue-bf-group .vue-bf-group-content {
    min-height: 120px;
  }
</style>
