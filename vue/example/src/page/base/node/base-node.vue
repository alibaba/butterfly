<template>
  <div class="base-node">
    <div>测试.vue 的node节点{{itemData.id}}</div>
    <div class="center">
      <el-button @click="click" type="success">button</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "base-node",
  props: {
    itemData: {
      type: Object,
    },
    canvasNode: {
      type: Object
    }
  },
  methods: {
    click(e) {
      console.log('click');
      e.stopPropagation();
    }
  },
  created() {
    // console.log(this.itemData);
    // console.log(this.canvasNode);
  }
};
</script>

<style scoped>
  .base-node {
    width: 190px;
    border-radius: 5px;
    border: 1px solid #aaa;
    padding: 10px;
    box-shadow: 3px 4px 16px #888888;
  }

  .base-node .center {
    text-align: center;
  }
</style>
