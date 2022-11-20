import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import useStore from '@/stores'

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/index.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/admin',
      name: 'admin',
      children: [
        {
          path: 'outlet',
          component: () => import('../views/admin/Outlet.vue'),
        },
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'user',
      children: [
        {
          path: 'space',
          component: () => import('../views/user/Space/index.vue'),
        },
        {
          path: 'order',
          component: () => import('../views/user/Order/index.vue'),
        },
        {
          path: 'price',
          component: () => import('../views/user/PriceQuery.vue'),
        },
        {
          path: 'address',
          component: () => import('../views/user/Address.vue'),
        },
        {
          path: 'outlet',
          component: () => import('../views/user/OutletQuery.vue'),
        },
      ],
      meta: { requiresAuth: true }
    },
  ],
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

router.beforeEach(async (to, from) => {
  // 而不是去检查每条路由记录
  // to.matched.some(record => record.meta.requiresAuth)
  // 每次都重新生成user，否则数据更新不及时
  const { user } = useStore()
  // console.log(user.isLoggedIn, user.token, from, to);
  
  if (to.meta.requiresAuth && !user.isLoggedIn) {
    // 如果没有登录，则重定向到登录页面
    return {
      name: 'login',
      // 保存我们所在的位置，以便以后再来
      query: { redirect: to.fullPath },
    }
  }
})

export default router
