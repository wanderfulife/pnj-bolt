<template>
  <div class="min-h-screen bg-dark-primary flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-dark-secondary rounded-lg shadow-xl p-6">
      <div class="flex justify-center mb-8">
        <!-- Logo placeholder -->
        <h1 class="text-2xl font-bold text-accent-primary">NPJ Chat</h1>
      </div>
      
      <!-- Auth pages will be rendered here -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>