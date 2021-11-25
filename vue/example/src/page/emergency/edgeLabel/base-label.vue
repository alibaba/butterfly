<template>
  <div class="label" @onClick="labelClick">
    {{this.itemData.userData.content}}
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
      this.$emit('click', 'emitlabelClick');
    }
  },
};
</script>

<style scope>
  .label {
    font-size: 12px;
    width: 30px;
    height: 18px;
    line-height: 18px;
    color: #222;
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid #D9D9D9;
    border-radius: 80px;
  }
</style>
