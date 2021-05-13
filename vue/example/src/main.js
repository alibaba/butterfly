import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router.js';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/main.css';

console.log(new Vue());

Vue.use(ElementUI);

console.log(new Vue());

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
