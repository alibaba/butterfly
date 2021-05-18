<template>
  <div :id="'bf_endpoint_'+id" :class="className">
    <slot>
      <div>
        {{id}}
      </div>
    </slot>
  </div>
</template>

<script>

export default {
  name: "butterfly-vue-endpoint",
  props: {
    id: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: 'vue-bf-endpoint-default'
    }
  },
};
</script>

<style scope>
  .vue-bf-endpoint-default {
    display: inline-block;
    width: 22px;
    height: 22px;
    border-radius: 5px;
    background-color: white;
    border: 1px solid #aaa;
    text-align: center;
  }
</style>
