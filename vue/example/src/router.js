import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/base'
  },
  {
    path: '/base',
    component: /*base*/ () => import( /* webpackChunkName: "Base" */ './page/App.vue'),
    meta: { title: '基础组件' },
  },
  {
    path: '/a',
    component: /*Home*/ () => import( /* webpackChunkName: "Home" */ './page/App-copy.vue'),
    meta: { title: '1' },
  },
  // {
  //   path: '/b',
  //   component: /*Home*/ () => import( /* webpackChunkName: "Home" */ './page/'),
  //   meta: { title: '2' },
  // }
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
