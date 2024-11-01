<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  const result = await authStore.login({
    email: email.value,
    password: password.value
  })

  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error
  }
  isLoading.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center text-text-primary">Welcome Back</h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="input-field"
          :disabled="isLoading"
        />
      </div>
      
      <div>
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="input-field"
          :disabled="isLoading"
        />
      </div>
      
      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>
      
      <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
    
    <p class="text-center text-text-secondary">
      Don't have an account?
      <router-link
        to="/auth/register"
        class="text-accent-primary hover:text-accent-secondary"
      >
        Sign Up
      </router-link>
    </p>
  </div>
</template>