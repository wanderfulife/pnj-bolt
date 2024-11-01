import { createRouter, createWebHistory } from 'vue-router'
import ChatLayout from '../layouts/ChatLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatLayout
    }
  ]
})

export { router }
export default router