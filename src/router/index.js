import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Lazy loading components
const ChatLayout = () => import('../layouts/ChatLayout.vue')
const AuthLayout = () => import('../layouts/AuthLayout.vue')
const Login = () => import('../views/auth/Login.vue')
const Register = () => import('../views/auth/Register.vue')
const Welcome = () => import('../views/auth/Welcome.vue')
const ChatView = () => import('../views/chat/ChatView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: ChatLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'chat',
          component: ChatView
        }
      ]
    },
    {
      path: '/auth',
      component: AuthLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'welcome',
          component: Welcome
        },
        {
          path: 'login',
          name: 'login',
          component: Login
        },
        {
          path: 'register',
          name: 'register',
          component: Register
        }
      ]
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth initialization
  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export { router }
export default router