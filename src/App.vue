<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useChatStore } from './stores/chat'
import LoadingSpinner from './components/shared/LoadingSpinner.vue'
import NetworkStatus from './components/shared/NetworkStatus.vue'
import NetworkCheck from './components/shared/NetworkCheck.vue'
import Notifications from './components/shared/Notifications.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const chatStore = useChatStore()
const router = useRouter()
const isInitializing = ref(true)
const error = ref(null)

// Create computed property for development mode
const isDevelopment = computed(() => import.meta.env.MODE === 'development')

onMounted(async () => {
  try {
    console.log('Initializing application...')
    await authStore.initialize()
    
    if (authStore.isAuthenticated) {
      console.log('User is authenticated, initializing chat...')
      await chatStore.initializeListeners()
      router.push('/')
    } else {
      console.log('User is not authenticated, redirecting to login...')
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('Initialization error:', error)
    error.value = error.message
  } finally {
    isInitializing.value = false
  }
})
</script>

<template>
  <div class="h-screen bg-dark-primary">
    <!-- Loading State -->
    <div v-if="isInitializing" class="h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-text-secondary">Loading application...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="h-screen flex flex-col items-center justify-center p-4">
      <div class="bg-red-500/10 text-red-500 p-4 rounded-lg max-w-md text-center">
        <p class="text-lg font-semibold mb-2">Something went wrong</p>
        <p class="text-sm">{{ error }}</p>
        <button 
          @click="window.location.reload()" 
          class="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <router-view v-else />
    
    <!-- Global Components -->
    <NetworkCheck v-if="isDevelopment" />
    <NetworkStatus />
    <Notifications />
  </div>
</template>