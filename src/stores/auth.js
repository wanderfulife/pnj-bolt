import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'
import { dbUtils } from '../firebase/utils'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        isLoading.value = true
        
        if (firebaseUser) {
          const userProfile = await dbUtils.getUserProfile(firebaseUser.uid)
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userProfile
          }
        } else {
          user.value = null
        }
        
        isLoading.value = false
        resolve()
      })
    })
  }

  async function register({ email, password, name }) {
    try {
      error.value = null
      isLoading.value = true
      
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      )
      
      await dbUtils.createUserProfile(firebaseUser.uid, {
        name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        status: 'online'
      })
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function login({ email, password }) {
    try {
      error.value = null
      isLoading.value = true
      
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await signOut(auth)
      user.value = null
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    initialize,
    register,
    login,
    logout
  }
})
