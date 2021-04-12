/**
 * 暂无使用
 */

import butterflyVue from './butterfly-vue.vue';

const install = (Vue)=>{
  Vue.component(butterflyVue.name, butterflyVue);
}

// 默认导出组件
export default {
  install,
  butterflyVue
};
