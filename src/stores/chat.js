import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbUtils } from '../firebase/utils'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const authStore = useAuthStore()
  let conversationsListener = null

  // Initialize listeners
  async function initializeListeners() {
    if (!authStore.user?.uid) return
    
    conversationsListener = dbUtils.listenToUserConversations(
      authStore.user.uid,
      (updatedConversations) => {
        conversations.value = updatedConversations
      }
    )
  }

  // Clean up listeners
  function cleanup() {
    if (conversationsListener) {
      conversationsListener()
      conversationsListener = null
    }
  }

  async function startConversation(userId) {
    try {
      isLoading.value = true
      error.value = null
      
      const firstMessage = {
        text: "Hey! Let's start chatting!",
        senderId: authStore.user.uid,
        senderName: authStore.user.name
      }
      
      const conversationId = await dbUtils.createConversation(
        [authStore.user.uid, userId],
        firstMessage
      )
      
      return { success: true, conversationId }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  return {
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    initializeListeners,
    cleanup,
    startConversation
  }
})