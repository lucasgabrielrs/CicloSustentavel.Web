import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import StockView from '../views/StockView.vue'
import ProfileView from '../views/ProfileView.vue'
import MyCompanyView from '../views/MyCompanyView.vue'
import SelectCompanyView from '../views/SelectCompanyView.vue'
import { isAuthenticated } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      redirect: '/stock',
    },
    {
      path: '/stock',
      name: 'stock',
      component: StockView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/minhaEmpresa',
      name: 'my-company',
      component: MyCompanyView,
      meta: { requiresAuth: true },
    },
    {
      path: '/select-company',
      name: 'select-company',
      component: SelectCompanyView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const authenticated = isAuthenticated()

  if (to.meta.requiresAuth && !authenticated) {
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.meta.guestOnly && authenticated) {
    return { path: '/stock' }
  }

  return true
})

export default router
