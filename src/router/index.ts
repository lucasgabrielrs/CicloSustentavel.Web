import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import StockView from '../views/StockView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      redirect: '/stock',
    },
    {
      path: '/stock',
      name: 'stock',
      component: StockView,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userId = localStorage.getItem('userId')
  const isAuthenticated = !!userId

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/stock')
  } else {
    next()
  }
})

export default router
