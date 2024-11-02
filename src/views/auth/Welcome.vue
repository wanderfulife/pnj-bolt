<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LoadingSpinner from '../../components/shared/LoadingSpinner.vue'
import { ref, onMounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(true)

onMounted(async () => {
  // Check if user is already authenticated
  if (authStore.isAuthenticated) {
    router.push('/')
    return
  }
  isLoading.value = false
})

function navigateToLogin() {
  router.push('/auth/login')
}

function navigateToRegister() {
  router.push('/auth/register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div v-if="isLoading" class="text-center">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="w-full max-w-md space-y-8">
      <!-- Logo/Icon placeholder -->
      <div class="text-center">
        <div class="w-20 h-20 mx-auto bg-accent-primary/10 rounded-full flex items-center justify-center">
          <span class="text-3xl text-accent-primary">NPJ</span>
        </div>
      </div>

      <!-- Welcome text -->
      <div class="space-y-4 text-center">
        <h1 class="text-3xl font-bold text-text-primary">Welcome to NPJ Chat</h1>
        <p class="text-text-secondary">Connect with NPCs and friends in real-time</p>
      </div>

      <!-- Action buttons -->
      <div class="space-y-4">
        <button 
          @click="navigateToLogin"
          class="btn btn-primary w-full py-3 font-medium transition-transform active:scale-95"
        >
          Sign In
        </button>
        
        <button 
          @click="navigateToRegister"
          class="btn btn-secondary w-full py-3 font-medium transition-transform active:scale-95"
        >
          Create Account
        </button>
      </div>

      <!-- Terms and Privacy -->
      <div class="text-sm text-text-secondary text-center">
        <p>By continuing, you agree to our</p>
        <div class="space-x-2 mt-1">
          <a 
            href="#" 
            class="text-accent-primary hover:text-accent-secondary transition-colors"
            @click.prevent="router.push('/terms')"
          >
            Terms of Service
          </a>
          <span>&</span>
          <a 
            href="#" 
            class="text-accent-primary hover:text-accent-secondary transition-colors"
            @click.prevent="router.push('/privacy')"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </div>
</template>