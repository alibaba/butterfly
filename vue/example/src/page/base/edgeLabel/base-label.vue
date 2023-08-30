<template>
  <div>
    <el-button type="primary" icon="el-icon-edit" circle @click="labelClick"></el-button>
  </div>
</template>

<script>
export default {
  name: "base-label",
  props: {
    itemData: {
      type: Object,
    },
  },
  methods: {
    labelClick() {
      console.log('labelClick');
      this.$emit('labelClick'); // 保持事件名一致
    }
  },
  created() {
    // console.log(this.itemData);
  }
};
</script>
