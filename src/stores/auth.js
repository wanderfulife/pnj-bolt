// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
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
              ...userProfile.data
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

      // Cleanup on SSR
      if (import.meta.env.SSR) {
        unsubscribe()
      }
    })
  }

  // Nouvelle fonction updateProfile
  async function updateProfile(profileData) {
    try {
      if (!user.value?.uid) {
        throw new Error('User must be authenticated to update profile')
      }

      isLoading.value = true
      error.value = null

      // Mettre à jour le profil dans Firestore
      const result = await dbUtils.updateUserProfile(user.value.uid, profileData)

      if (result.success) {
        // Mettre à jour le state local
        user.value = {
          ...user.value,
          ...profileData,
          profile: {
            ...user.value.profile,
            ...profileData.profile
          }
        }
        
        return { success: true }
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('Update profile error:', err)
      error.value = err.message
      return { 
        success: false, 
        error: err.message 
      }
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithGoogle() {
    try {
      error.value = null
      isLoading.value = true

      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Vérifier si le profil existe
      const userProfile = await dbUtils.getUserProfile(firebaseUser.uid)
      
      // Créer le profil s'il n'existe pas
      if (!userProfile.success) {
        await dbUtils.createUserProfile(firebaseUser.uid, {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.displayName)}`,
          status: 'online',
          provider: 'google'
        })
      }

      return { success: true, user: firebaseUser }
    } catch (err) {
      console.error('Google login error:', err)
      error.value = err.message
      return { 
        success: false, 
        error: err.message 
      }
    } finally {
      isLoading.value = false
    }
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
        error: err.message 
      }
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
    isInitialized,
    initialize,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfile // Nouvelle fonction exportée
  }
})