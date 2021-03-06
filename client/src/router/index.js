import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Home from '../views/blog/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'index',
        name: 'Index',
        alias: '/',
        component: () => import('../views/blog/pages/Index.vue'),
      },
      {
        path: 'categories/:id',
        name: 'Categories',
        component: () => import('../views/blog/pages/Categories.vue'),
      },
      {
        path: 'tags/:id',
        name: 'Tags',
        component: () => import('../views/blog/pages/Tags.vue'),
      },
      {
        path: 'blogs/:id',
        name: 'BlogsDetail',
        component: () => import('../views/blog/pages/BlogsDetail.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/blog/pages/About.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('../views/blog/pages/Message.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/admin/Login.vue'),
  },
  {
    path: '/adminHome',
    name: 'AdminHome',
    redirect: { name: 'AddBlog' },
    component: () => import('../views/admin/AdminHome.vue'),
    meta: {
      needLogin: true,
    },
    children: [
      {
        path: 'addBlog',
        name: 'AddBlog',
        component: () => import('../views/admin/pages/AddBlog.vue'),
        meta: {
          needLogin: true,
        },
      },
      {
        path: 'updateBlog',
        name: 'UpdateBlog',
        component: () => import('../views/admin/pages/UpdateBlog.vue'),
        meta: {
          needLogin: true,
        },
      },
    ],
  },
];

// 解决重复点击路由报错的问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

NProgress.configure({
  showSpinner: false, // 隐藏加载环
});

// beforeEach被触发时，App.vue中的mounted钩子函数还没执行，即未请求whoami接口进行登录验证，故此时的userData始终为null。
// beforeResolve守卫中的回调执行的时间介于：App.vue的mounted 和 需要登录才能访问的xxx.vue的beforeCreated 之间。但晚于beforeEach。
// 此处通过localStorage来判断是否登录，则可以避免上述问题的出现
router.beforeEach((to, from, next) => {
  NProgress.start();
  const userData = localStorage.getItem('userData');
  if (to.meta.needLogin && !userData) {
    NProgress.done();
    // 如果未登录，跳转到登录页Login；否则，按照正常逻辑处理
    next({ name: 'Login' });
  }
  if (to.name === 'Login' && userData) {
    NProgress.done();
    // 如果已登录，则跳转到管理员首页AdminHome；否则，按正常逻辑跳转到Login
    next({ name: 'AdminHome' });
  }
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
