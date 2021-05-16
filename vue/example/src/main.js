import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router.js';

import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/main.css';

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
