// stores/chat.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbUtils } from '../firebase/utils'

export const useChatStore = defineStore('chat', () => {
  // State
  const conversations = ref([])
  const activeConversation = ref(null)
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Cache local
  const messagesCache = new Map()
  let conversationsListener = null
  let messagesListener = null

  // Getters
  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => {
      return new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp)
    })
  })

  const unreadCount = computed(() => {
    return conversations.value.reduce((total, conv) => 
      total + (conv.unreadCount || 0), 0)
  })

  // Actions
  async function initializeListeners(userId) {
    if (!userId) return
    
    try {
      // Nettoyer les listeners existants
      cleanup()
      
      // Écouter les conversations
      conversationsListener = dbUtils.listenToUserConversations(
        userId,
        (updatedConversations) => {
          conversations.value = updatedConversations
        }
      )
    } catch (err) {
      console.error('Initialize listeners error:', err)
      error.value = err.message
    }
  }

  async function setActiveConversation(conversationId) {
    try {
      isLoading.value = true
      
      // Nettoyer l'ancien listener de messages
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
        
        // Utiliser le cache si disponible
        if (messagesCache.has(conversationId)) {
          messages.value = messagesCache.get(conversationId)
        }
        
        // Configurer le nouveau listener
        messagesListener = dbUtils.listenToMessages(
          conversationId,
          (updatedMessages) => {
            messages.value = updatedMessages
            messagesCache.set(conversationId, updatedMessages)
          }
        )

        // Marquer comme lu
        await dbUtils.markConversationAsRead(conversationId)
      }
    } catch (err) {
      console.error('Set active conversation error:', err)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  function cleanup() {
    if (conversationsListener) {
      conversationsListener()
      conversationsListener = null
    }
    if (messagesListener) {
      messagesListener()
      messagesListener = null
    }
    messagesCache.clear()
  }

  return {
    // State
    conversations,
    activeConversation,
    messages,
    isLoading,
    error,
    
    // Getters
    sortedConversations,
    unreadCount,
    
    // Actions
    initializeListeners,
    setActiveConversation,
    cleanup
  }
})