<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

function handleLogin() {
  authStore.login({ email: email.value, password: password.value })
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-dark-bg p-4">
    <div class="bg-dark-secondary p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6 text-text-primary">Login to NPC Chat</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-text-primary">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md bg-dark-hover border-dark-hover text-text-primary p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-primary">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md bg-dark-hover border-dark-hover text-text-primary p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white p-2.5 rounded-md hover:bg-secondary transition-colors"
        >
          Login
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-text-secondary">
        Don't have an account?
        <router-link to="/register" class="text-primary hover:text-secondary">Register</router-link>
      </p>
    </div>
  </div>
</template>