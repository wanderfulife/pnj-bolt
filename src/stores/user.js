import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({
    id: '1',
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
    status: 'online',
    profile: {
      bio: 'AI enthusiast and technology lover',
      location: 'Paris, France',
      email: 'user@example.com',
      joined: 'January 2024',
      interests: ['AI', 'Technology', 'Photography', 'Art']
    }
  })
  
  const isAuthenticated = ref(true)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const userInitials = computed(() => {
    return user.value.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })

  // Actions
  async function updateProfile(updates) {
    try {
      isLoading.value = true
      user.value = {
        ...user.value,
        ...updates
      }
    } catch (err) {
      error.value = err
      console.error('Error updating profile:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function setStatus(status) {
    try {
      isLoading.value = true
      user.value.status = status
    } catch (err) {
      error.value = err
      console.error('Error setting status:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      isLoading.value = true
      isAuthenticated.value = false
      user.value = null
    } catch (err) {
      error.value = err
      console.error('Error logging out:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userInitials,
    updateProfile,
    setStatus,
    logout
  }
})