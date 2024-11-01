import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AI_RESPONSES, MESSAGE_STATUS, CHAT_TYPES } from '../constants/chatConstants'

export const useChatStore = defineStore('chat', () => {
  // State
  const activeChat = ref(null)
  const conversations = ref([
    {
      id: '1',
      name: "Sarah's AI",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      status: 'online',
      lastMessage: "Looking forward to...",
      timestamp: new Date(),
      unread: 0,
      type: CHAT_TYPES.AI,
      messages: [
        {
          id: 1,
          text: "Hi! I'd love to learn more about your interests. What kind of activities do you enjoy?",
          sender: 'ai',
          timestamp: new Date(Date.now() - 3600000),
          status: MESSAGE_STATUS.DELIVERED
        },
        {
          id: 2,
          text: "I'm really into hiking and photography. I love capturing beautiful landscapes!",
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000),
          status: MESSAGE_STATUS.SEEN
        }
      ]
    },
    // ... other conversations
  ])
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
  })

  const groupedConversations = computed(() => ({
    [CHAT_TYPES.AI]: conversations.value.filter(c => c.type === CHAT_TYPES.AI),
    [CHAT_TYPES.FRIEND]: conversations.value.filter(c => c.type === CHAT_TYPES.FRIEND)
  }))

  // Actions
  async function setActiveChat(chatId) {
    try {
      isLoading.value = true
      const chat = conversations.value.find(c => c.id === chatId)
      
      if (chat) {
        activeChat.value = chat
        if (chat.unread > 0) {
          await markChatAsRead(chatId)
        }
      } else {
        activeChat.value = null
      }
    } catch (err) {
      error.value = err
      console.error('Error setting active chat:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(text) {
    if (!activeChat.value || !text.trim()) return

    try {
      const newMessage = {
        id: Date.now(),
        text: text.trim(),
        sender: 'user',
        timestamp: new Date(),
        status: MESSAGE_STATUS.SENDING
      }

      // Add message to conversation
      if (!activeChat.value.messages) {
        activeChat.value.messages = []
      }
      activeChat.value.messages.push(newMessage)
      
      // Update conversation metadata
      activeChat.value.lastMessage = text.trim()
      activeChat.value.timestamp = new Date()

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      newMessage.status = MESSAGE_STATUS.SENT

      // Simulate AI response
      if (activeChat.value.type === CHAT_TYPES.AI) {
        await simulateAIResponse()
      }
    } catch (err) {
      error.value = err
      console.error('Error sending message:', err)
    }
  }

  async function simulateAIResponse() {
    const aiResponse = {
      id: Date.now(),
      text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
      sender: 'ai',
      timestamp: new Date(),
      status: MESSAGE_STATUS.DELIVERED
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    activeChat.value.messages.push(aiResponse)
    activeChat.value.lastMessage = aiResponse.text
    activeChat.value.timestamp = new Date()
  }

  async function markChatAsRead(chatId) {
    const chat = conversations.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread = 0
      chat.messages?.forEach(msg => {
        if (msg.sender !== 'user') {
          msg.status = MESSAGE_STATUS.SEEN
        }
      })
    }
  }

  return {
    activeChat,
    conversations,
    isLoading,
    error,
    sortedConversations,
    groupedConversations,
    setActiveChat,
    sendMessage,
    markChatAsRead
  }
})