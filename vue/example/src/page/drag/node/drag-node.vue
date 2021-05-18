<template>
  <div class="drag-node">
    <div class="drag-header">
      {{itemData.userData.title}}
    </div>
    <div class="drag-content">
      <div class="info">
        <el-input v-model="itemData.userData.input" placeholder="请输入内容" size="small" />
      </div>
      <div class="drag-history">
        修改: {{itemData.userData.modify}} 阅读: {{itemData.userData.reader}}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "drag-node",

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
  .drag-node {
    width: 200px;
    box-shadow: 0 2px 3px 0 rgba(0,112,204,0.06);;
    background-color: #fff;
    border-radius:0 0 5px 5px;
    /* overflow: hidden; */
  }

  .drag-header {
    padding: 5px;
    border-radius: 5px 5px 0 0;
    color: #FFF;
    background-color: #F66902;
    border: 1px solid #aaa;
  }

  .drag-content {
    color: #222;
    padding: 10px;
    border: 1px solid #D9D9D9;
    border-top: none;
    border-radius: 0 0 5px 5px;
  }

  .drag-history {
    padding: 5px 0;
    font-size: 12px;
    border-top: 1px solid #eee;
    margin-top: 10px;
  }

</style>
