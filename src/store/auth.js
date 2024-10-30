import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      user.value = {
        id: '1',
        email: credentials.email,
        name: 'Demo User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
      }
      isAuthenticated.value = true
      
      // Store auth token
      localStorage.setItem('auth_token', 'demo_token')
    } catch (err) {
      error.value = 'Login failed. Please try again.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('auth_token')
  }

  // Check if user is already authenticated on app load
  function checkAuth() {
    const token = localStorage.getItem('auth_token')
    if (token) {
      isAuthenticated.value = true
      user.value = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
      }
    }
  }

  // Initialize auth state
  checkAuth()

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth
  }
})