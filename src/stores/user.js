import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
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

  function updateProfile(updates) {
    user.value = {
      ...user.value,
      ...updates
    }
  }

  function setStatus(status) {
    user.value.status = status
  }

  return {
    user,
    isAuthenticated,
    updateProfile,
    setStatus
  }
})