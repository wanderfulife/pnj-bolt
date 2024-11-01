<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useChatStore } from './stores/chat'
import LoadingSpinner from './components/shared/LoadingSpinner.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const chatStore = useChatStore()
const router = useRouter()
const isInitializing = ref(true)

onMounted(async () => {
  try {
    await authStore.initialize()
    
    if (authStore.isAuthenticated) {
      await chatStore.initializeListeners()
      router.push('/')
    } else {
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Initialization error:', error)
  } finally {
    isInitializing.value = false
  }
})
</script>

<template>
  <div class="h-screen bg-dark-primary">
    <div v-if="isInitializing" class="h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
    
    <router-view v-else />
  </div>
</template>