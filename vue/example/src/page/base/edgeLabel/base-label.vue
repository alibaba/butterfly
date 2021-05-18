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
    labelClick(e) {
      console.log('labelClick');
      e.stopPropagation();
    }
  },
  created() {
    // console.log(this.itemData);
  }
};
</script>
