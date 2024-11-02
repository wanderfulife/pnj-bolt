// components/auth/AuthForm.vue
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/services/notificationService'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: value => ['login', 'register'].includes(value)
  }
})

const router = useRouter()
const authStore = useAuthStore()
const notifications = useNotifications()

// Form state
const formData = ref({
  email: '',
  password: '',
  name: '',
})

const isLoading = ref(false)
const isGoogleLoading = ref(false)
const formError = ref('')

// Computed
const isFormValid = computed(() => {
  const { email, password, name } = formData.value
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || !password) return false
  if (!emailRegex.test(email)) return false
  if (password.length < 6) return false
  if (props.mode === 'register' && !name.trim()) return false

  return true
})

const submitButtonText = computed(() => {
  if (isLoading.value) {
    return props.mode === 'login' ? 'Signing in...' : 'Creating account...'
  }
  return props.mode === 'login' ? 'Sign In' : 'Create Account'
})

// Methods
async function handleGoogleAuth() {
  try {
    isGoogleLoading.value = true
    formError.value = ''

    const result = await authStore.loginWithGoogle()
    if (result.success) {
      notifications.success(`Welcome${result.user?.name ? ` ${result.user.name}` : ''}!`)
      router.push('/')
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    formError.value = error.message
    notifications.error('Google sign in failed')
  } finally {
    isGoogleLoading.value = false
  }
}

async function handleSubmit() {
  if (!isFormValid.value) {
    formError.value = 'Please check all fields'
    return
  }

  try {
    isLoading.value = true
    formError.value = ''

    const authAction = props.mode === 'login' 
      ? authStore.login(formData.value)
      : authStore.register(formData.value)

    const result = await authAction
    
    if (result.success) {
      notifications.success(
        props.mode === 'login' 
          ? 'Welcome back!' 
          : 'Account created successfully!'
      )
      router.push('/')
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    formError.value = error.message
    notifications.error(formError.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Google Sign In -->
    <button
      type="button"
      @click="handleGoogleAuth"
      :disabled="isGoogleLoading"
      class="w-full btn bg-white hover:bg-gray-50 text-gray-900 flex items-center justify-center space-x-2 relative overflow-hidden"
    >
      <div 
        v-if="isGoogleLoading" 
        class="absolute inset-0 bg-black/5 flex items-center justify-center"
      >
        <LoadingSpinner size="sm" color="primary" />
      </div>
      <div v-else class="flex items-center space-x-2">
        <svg class="w-5 h-5" viewBox="0 0 48 48">
          <!-- Google logo path -->
        </svg>
        <span>{{ props.mode === 'login' ? 'Sign in' : 'Sign up' }} with Google</span>
      </div>
    </button>

    <!-- Divider -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border-color"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-dark-secondary text-text-secondary">
          Or continue with email
        </span>
      </div>
    </div>

    <!-- Name field for register -->
    <div v-if="props.mode === 'register'">
      <label class="block text-sm font-medium text-text-secondary mb-1">
        Full Name
      </label>
      <input
        v-model="formData.name"
        type="text"
        class="input-field w-full"
        :class="{ 'border-red-500': formError && !formData.name }"
        placeholder="John Cohen"
        :disabled="isLoading"
      />
    </div>

    <!-- Email field -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-1">
        Email
      </label>
      <input
        v-model="formData.email"
        type="email"
        class="input-field w-full"
        :class="{ 'border-red-500': formError && !formData.email }"
        placeholder="jay@jaycorp.com"
        :disabled="isLoading"
      />
    </div>

    <!-- Password field -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-1">
        Password
      </label>
      <input
        v-model="formData.password"
        type="password"
        class="input-field w-full"
        :class="{ 'border-red-500': formError && !formData.password }"
        placeholder="••••••••"
        :disabled="isLoading"
      />
    </div>

    <!-- Error message -->
    <TransitionGroup name="fade">
      <div 
        v-if="formError"
        key="error"
        class="text-red-500 text-sm text-center bg-red-500/10 rounded-lg p-2"
      >
        {{ formError }}
      </div>
    </TransitionGroup>

    <!-- Submit button -->
    <button
      type="submit"
      class="btn btn-primary w-full relative"
      :disabled="isLoading || !isFormValid"
    >
      <LoadingSpinner 
        v-if="isLoading"
        size="sm"
        color="white"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
      <span :class="{ 'opacity-0': isLoading }">
        {{ submitButtonText }}
      </span>
    </button>

    <!-- Switch mode link -->
    <p class="text-center text-text-secondary">
      {{ props.mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
      <router-link
        :to="props.mode === 'login' ? '/auth/register' : '/auth/login'"
        class="text-accent-primary hover:text-accent-secondary font-medium"
      >
        {{ props.mode === 'login' ? 'Sign Up' : 'Sign In' }}
      </router-link>
    </p>
  </form>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Animation pour le spinner de chargement */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spin {
  animation: spin 1s linear infinite;
}
</style>