import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import { auth } from './index'
import { dbUtils } from './utils'

export const authGoogle = {
  // Provider instance
  provider: new GoogleAuthProvider(),
  
  // Sign in with popup (recommended for web)
  async signInWithPopup() {
    try {
      const result = await signInWithPopup(auth, this.provider)
      const user = result.user
      
      // Check if user exists in our database
      const userProfile = await dbUtils.getUserProfile(user.uid)
      
      // If user doesn't exist, create profile
      if (!userProfile.success) {
        await dbUtils.createUserProfile(user.uid, {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          status: 'online',
          provider: 'google'
        })
      }
      
      return { success: true, user }
    } catch (error) {
      console.error('Google auth error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  },
  
  // Sign in with redirect (recommended for mobile)
  async signInWithRedirect() {
    try {
      await signInWithRedirect(auth, this.provider)
      return { success: true }
    } catch (error) {
      console.error('Google redirect error:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  },
  
  // Handle redirect result
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const user = result.user
        // Check and create profile if needed
        const userProfile = await dbUtils.getUserProfile(user.uid)
        if (!userProfile.success) {
          await dbUtils.createUserProfile(user.uid, {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            status: 'online',
            provider: 'google'
          })
        }
        return { success: true, user }
      }
      return { success: false }
    } catch (error) {
      console.error('Handle redirect error:', error)
      return { 
        success: false, 
        error: error.message 
      }
    }
  }
}