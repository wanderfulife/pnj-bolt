<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LoadingSpinner from '../shared/LoadingSpinner.vue'
import { useNotifications } from '../../services/notificationService'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value)
  }
})

const router = useRouter()
const authStore = useAuthStore()
const notifications = useNotifications()

const formData = ref({
  email: '',
  password: '',
  name: ''
})

const isLoading = ref(false)
const isGoogleLoading = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  const { email, password, name } = formData.value
  if (props.mode === 'register') {
    return email && password && name && password.length >= 6
  }
  return email && password
})

const title = computed(() => props.mode === 'login' ? 'Welcome Back' : 'Create Account')
const buttonText = computed(() => {
  if (isLoading.value) {
    return props.mode === 'login' ? 'Signing in...' : 'Creating account...'
  }
  return props.mode === 'login' ? 'Sign In' : 'Sign Up'
})

async function handleGoogleAuth() {
  try {
    isGoogleLoading.value = true
    error.value = ''

    const result = await authStore.loginWithGoogle()
    
    if (result.success) {
      notifications.success('Signed in with Google successfully!')
      router.push('/')
    } else {
      error.value = result.error || 'Google authentication failed'
      notifications.error(error.value)
    }
  } catch (err) {
    error.value = err.message
    notifications.error(error.value)
  } finally {
    isGoogleLoading.value = false
  }
}

async function handleSubmit() {
  if (!isFormValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const result = props.mode === 'login'
      ? await authStore.login(formData.value)
      : await authStore.register(formData.value)

    if (result.success) {
      notifications.success(
        props.mode === 'login' 
          ? 'Welcome back!' 
          : 'Account created successfully!'
      )
      router.push('/')
    } else {
      error.value = result.error || 'Authentication failed'
      notifications.error(error.value)
    }
  } catch (err) {
    error.value = err.message
    notifications.error(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold text-center text-text-primary">
      {{ title }}
    </h1>

    <!-- Google Sign In -->
    <button
      @click="handleGoogleAuth"
      :disabled="isGoogleLoading"
      class="w-full btn bg-white hover:bg-gray-50 text-gray-900 flex items-center justify-center space-x-2"
    >
      <LoadingSpinner 
        v-if="isGoogleLoading"
        size="sm"
        color="primary"
        class="mr-2"
      />
      <svg v-else class="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
      </svg>
      <span>{{ mode === 'login' ? 'Sign in' : 'Sign up' }} with Google</span>
    </button>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border-color"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-dark-primary text-text-secondary">
          Or continue with email
        </span>
      </div>
    </div>
    
    <!-- Email/Password Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="mode === 'register'">
        <input
          v-model="formData.name"
          type="text"
          placeholder="Full Name"
          class="input-field w-full"
          :disabled="isLoading"
          autocomplete="name"
        />
      </div>
      
      <div>
        <input
          v-model="formData.email"
          type="email"
          placeholder="Email"
          class="input-field w-full"
          :disabled="isLoading"
          autocomplete="email"
        />
      </div>
      
      <div>
        <input
          v-model="formData.password"
          type="password"
          placeholder="Password"
          class="input-field w-full"
          :disabled="isLoading"
          autocomplete="current-password"
        />
      </div>
      
      <div 
        v-if="error"
        class="text-red-500 text-sm text-center"
      >
        {{ error }}
      </div>
      
      <button
        type="submit"
        class="btn btn-primary w-full flex items-center justify-center"
        :disabled="isLoading || !isFormValid"
      >
        <LoadingSpinner 
          v-if="isLoading"
          size="sm"
          color="white"
          class="mr-2"
        />
        {{ buttonText }}
      </button>
    </form>
    
    <p class="text-center text-text-secondary">
      {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
      <router-link
        :to="mode === 'login' ? '/auth/register' : '/auth/login'"
        class="text-accent-primary hover:text-accent-secondary"
      >
        {{ mode === 'login' ? 'Sign Up' : 'Sign In' }}
      </router-link>
    </p>
  </div>
</template>