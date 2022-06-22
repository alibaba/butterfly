<template>
  <div v-on="$listeners" :id="'bf_endpoint_'+id" :class="className">
    <slot>
      <div>
        {{id}}
      </div>
    </slot>
  </div>
</template>

<script>
import _ from 'lodash';

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
    },
    param: {
      type: Object
    }
  },
  methods: {
    findParent(self) {
      if (self.$parent) {
        let type = _.get(self, '$parent.$butterfly.type', false);
        if (type) {
          if (['node'].includes(type) && _.get(self, '$parent.$options.propsData.canvasNode', false)) {
            return self.$parent;
          }
        } else {
          return this.findParent(self.$parent)
        }
      } else {
        console.warn('锚点没有被node包裹上,请检查！');
      }
    }
  },
  mounted() {
    let butterflyParent = this.findParent(this);
    let canvasNode = _.get(butterflyParent, '$options.propsData.canvasNode', false);
    if (canvasNode && !canvasNode.getEndpoint('bf_endpoint_' + this.id)) {
      canvasNode.addEndpoint({
        id: 'bf_endpoint_' + this.id,
        dom: this.$el,
        ...this.param
      });
    }
  },
  beforeDestroy() {
    let butterflyParent = this.findParent(this);
    if (butterflyParent.canvasNode.getEndpoint('bf_endpoint_' + this.id)) {
      butterflyParent.canvasNode.removeEndpoint('bf_endpoint_' + this.id);
    }
  }
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
