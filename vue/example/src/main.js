import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router.js';
import Vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/main.css';

Vue.use(ElementUI);
Vue.use(Vuetify);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
