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
  let messagesListener = null

  const totalUnread = computed(() => {
    return conversations.value.reduce((total, conv) => total + (conv.unreadCount || 0), 0)
  })

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
    if (messagesListener) {
      messagesListener()
      messagesListener = null
    }
  }

  async function setActiveConversation(conversationId) {
    try {
      if (messagesListener) {
        messagesListener()
        messagesListener = null
      }

      if (!conversationId) {
        activeConversation.value = null
        messages.value = []
        return
      }

      const conversation = conversations.value.find(c => c.id === conversationId)
      if (conversation) {
        activeConversation.value = conversation
        
        // Subscribe to messages
        messagesListener = dbUtils.listenToMessages(conversationId, (updatedMessages) => {
          messages.value = updatedMessages
        })

        // Mark messages as seen
        await dbUtils.markMessagesAsSeen(conversationId, authStore.user.uid)
      }
    } catch (err) {
      console.error('Error setting active conversation:', err)
      error.value = err.message
    }
  }

  async function startConversation(userId) {
    try {
      isLoading.value = true
      error.value = null

      const firstMessage = {
        text: "Hey! Let's start chatting!",
        senderId: authStore.user.uid,
        senderName: authStore.user.name,
        senderAvatar: authStore.user.avatar,
        timestamp: new Date().toISOString(),
        status: 'sent'
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
    totalUnread,
    initializeListeners,
    cleanup,
    startConversation,
    setActiveConversation
  }
})