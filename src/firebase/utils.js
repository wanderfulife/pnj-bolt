import { db, auth } from './index'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore'

export const dbUtils = {
  // User operations
  async createUserProfile(uid, userData) {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  },

  async getUserProfile(uid) {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? userSnap.data() : null
  },

  async updateUserProfile(uid, updates) {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  },

  // Conversation operations
  listenToUserConversations(uid, callback) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', uid),
      orderBy('updatedAt', 'desc')
    )
    
    return onSnapshot(q, (snapshot) => {
      const conversations = []
      snapshot.forEach((doc) => {
        conversations.push({ id: doc.id, ...doc.data() })
      })
      callback(conversations)
    })
  },

  async createConversation(participants, firstMessage) {
    const convRef = doc(collection(db, 'conversations'))
    await setDoc(convRef, {
      participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: firstMessage
    })
    
    // Create first message
    await setDoc(doc(collection(db, `conversations/${convRef.id}/messages`)), {
      ...firstMessage,
      timestamp: new Date().toISOString()
    })
    
    return convRef.id
  }
}