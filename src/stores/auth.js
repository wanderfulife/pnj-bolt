import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase'
import { dbUtils } from '../firebase/utils'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(true)
  const error = ref(null)
  const isInitialized = ref(false)
  const googleProvider = new GoogleAuthProvider()

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        isLoading.value = true
        try {
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
        } catch (err) {
          console.error('Profile fetch error:', err)
          user.value = null
        } finally {
          isLoading.value = false
          isInitialized.value = true
          resolve()
        }
      })

      if (import.meta.env.SSR) {
        unsubscribe()
      }
    })
  }

  async function loginWithGoogle() {
    try {
      error.value = null
      isLoading.value = true

      if (!navigator.onLine) {
        throw new Error('No internet connection')
      }

      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Check if user profile exists
      const userProfile = await dbUtils.getUserProfile(firebaseUser.uid)
      
      // Create profile if it doesn't exist
      if (!userProfile.success) {
        await dbUtils.createUserProfile(firebaseUser.uid, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName)}`,
          status: 'online',
          provider: 'google'
        })
      }

      return { success: true }
    } catch (err) {
      console.error('Google login error:', err)
      error.value = err.message
      return { 
        success: false, 
        error: err.code || err.message 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register({ email, password, name }) {
    try {
      error.value = null
      isLoading.value = true
      
      if (!email || !password || !name) {
        throw new Error('All fields are required')
      }

      if (!navigator.onLine) {
        throw new Error('No internet connection')
      }

      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      )
      
      await dbUtils.createUserProfile(firebaseUser.uid, {
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        status: 'online',
        provider: 'email'
      })
      
      return { success: true }
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message
      return { 
        success: false, 
        error: err.code || err.message 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function login({ email, password }) {
    try {
      error.value = null
      isLoading.value = true
      
      if (!navigator.onLine) {
        throw new Error('No internet connection')
      }

      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.code || err.message }
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
    isInitialized,
    initialize,
    register,
    login,
    loginWithGoogle,
    logout
  }
})