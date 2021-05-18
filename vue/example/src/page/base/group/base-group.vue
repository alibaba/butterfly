<template>
  <div @click="click">
    <div class="base-group">
      <div class="base-group-header">
        {{itemData.userData.name}}
      </div>
      <div class="base-group-content"></div> 
    </div>
  </div>
</template>

<script>
export default {
  name: "base-group",
  props: {
    itemData: {
      type: Object,
    },
  },
  methods: {
    click() {
      console.log('group click');
    },
  },
  created() {
    // console.log(this.nodeData);
  }
};
</script>

<style scoped>
  .base-group {
    border-radius: 5px;
    min-width: 250px;
    box-shadow: 3px 4px 16px #888888;
  }

  .base-group .base-group-header {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    height: 30px;
    background-color: #aaa;
    text-align: center;
    line-height: 30px;
  }

  .base-group .base-group-content {
    min-height: 120px;
  }
</style>
