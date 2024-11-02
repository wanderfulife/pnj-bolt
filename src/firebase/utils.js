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
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'

export const dbUtils = {
  // User operations
  async createUserProfile(uid, userData) {
    try {
      const batch = writeBatch(db)
      
      // Create main user profile
      const userRef = doc(db, 'users', uid)
      batch.set(userRef, {
        ...userData,
        uid, // Always include uid in the document
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      await batch.commit()
      return { success: true }
    } catch (error) {
      console.error('Create user profile error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  },

  async getUserProfile(uid) {
    try {
      const userRef = doc(db, 'users', uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        return { success: false, error: 'User profile not found' }
      }
      
      return {
        success: true,
        data: userSnap.data()
      }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  },

  async updateUserProfile(uid, updates) {
    try {
      if (auth.currentUser?.uid !== uid) {
        throw new Error('Unauthorized profile update')
      }

      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Update user profile error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  },

  // Conversation operations
  listenToUserConversations(uid, callback) {
    if (!uid) {
      console.error('No uid provided for conversations listener')
      return () => {}
    }

    try {
      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', uid),
        orderBy('updatedAt', 'desc')
      )
      
      return onSnapshot(q, 
        (snapshot) => {
          const conversations = []
          snapshot.forEach((doc) => {
            conversations.push({ 
              id: doc.id, 
              ...doc.data(),
            })
          })
          callback(conversations)
        },
        (error) => {
          console.error('Conversations listener error:', error)
          // Notify the UI about the error
          callback([], error)
        }
      )
    } catch (error) {
      console.error('Setup conversations listener error:', error)
      callback([], error)
      return () => {}
    }
  },

  async createConversation(participants, firstMessage) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('User must be authenticated')
      if (!participants.includes(currentUser.uid)) {
        throw new Error('Current user must be a participant')
      }

      const batch = writeBatch(db)
      
      // Create conversation document
      const convRef = doc(collection(db, 'conversations'))
      batch.set(convRef, {
        participants,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
          ...firstMessage,
          timestamp: serverTimestamp()
        },
        createdBy: currentUser.uid
      })
      
      // Create first message
      const messageRef = doc(collection(db, `conversations/${convRef.id}/messages`))
      batch.set(messageRef, {
        ...firstMessage,
        timestamp: serverTimestamp(),
        senderId: currentUser.uid
      })
      
      await batch.commit()
      return { 
        success: true, 
        conversationId: convRef.id 
      }
    } catch (error) {
      console.error('Create conversation error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  },

  // Messages operations
  listenToMessages(conversationId, callback) {
    if (!conversationId) {
      console.error('No conversationId provided for messages listener')
      return () => {}
    }

    try {
      const q = query(
        collection(db, `conversations/${conversationId}/messages`),
        orderBy('timestamp', 'asc')
      )
      
      return onSnapshot(q,
        (snapshot) => {
          const messages = []
          snapshot.forEach((doc) => {
            messages.push({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate().toISOString()
            })
          })
          callback(messages)
        },
        (error) => {
          console.error('Messages listener error:', error)
          callback([], error)
        }
      )
    } catch (error) {
      console.error('Setup messages listener error:', error)
      callback([], error)
      return () => {}
    }
    },
  
  

  async sendMessage(conversationId, messageData) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('User must be authenticated')

      const convRef = doc(db, 'conversations', conversationId)
      const convSnap = await getDoc(convRef)
      
      if (!convSnap.exists()) {
        throw new Error('Conversation not found')
      }
      
      const convData = convSnap.data()
      if (!convData.participants.includes(currentUser.uid)) {
        throw new Error('User is not a participant in this conversation')
      }

      const batch = writeBatch(db)
      
      // Add new message
      const messageRef = doc(collection(db, `conversations/${conversationId}/messages`))
      const messageContent = {
        ...messageData,
        senderId: currentUser.uid,
        timestamp: serverTimestamp()
      }
      batch.set(messageRef, messageContent)
      
      // Update conversation's lastMessage
      batch.update(convRef, {
        lastMessage: messageContent,
        updatedAt: serverTimestamp()
      })
      
      await batch.commit()
      return { success: true }
    } catch (error) {
      console.error('Send message error:', error)
      return { 
        success: false, 
        error: error.message,
        code: error.code
      }
    }
  }
}