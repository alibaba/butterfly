import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/emergency'
  },
  {
    path: '/base',
    component: /*base*/ () => import( /* webpackChunkName: "Base" */ './page/base/base.vue'),
    meta: { title: '基础用法' },
  },
  {
    path: '/userEndpoint',
    component: /*userEndpoint*/ () => import( /* webpackChunkName: "UserEndpoint" */ './page/userEndpoint/user-endpoint.vue'),
    meta: { title: '自定义锚点用法' },
  },
  {
    path: '/emergency',
    component: /*emergency*/ () => import( /* webpackChunkName: "emergency" */ './page/emergency/emergency.vue'),
    meta: { title: 'emergency' },
  },
  {
    path: '/drag',
    component: /*drag*/ () => import( /* webpackChunkName: "drag" */ './page/drag/drag.vue'),
    meta: { title: 'drag' },
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
