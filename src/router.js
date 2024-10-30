import { createRouter, createWebHistory } from 'vue-router'
import ChatLayout from './layouts/ChatLayout.vue'

const routes = [
  {
    path: '/',
    component: ChatLayout
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})