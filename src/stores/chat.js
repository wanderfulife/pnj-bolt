import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
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
      type: 'AI',
      messages: [
        {
          id: 1,
          text: "Hi! I'd love to learn more about your interests. What kind of activities do you enjoy?",
          sender: 'ai',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 2,
          text: "I'm really into hiking and photography. I love capturing beautiful landscapes!",
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000),
        }
      ]
    },
    {
      id: '2',
      name: "Mike's AI",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      status: 'online',
      lastMessage: "That's an interestin...",
      timestamp: new Date(Date.now() - 86400000),
      unread: 0,
      type: 'AI',
      messages: []
    },
    {
      id: '3',
      name: "Emma Wilson",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      status: 'offline',
      lastMessage: "Let's meet up this...",
      timestamp: new Date(Date.now() - 172800000),
      unread: 1,
      type: 'Friend',
      messages: []
    }
  ])

  function setActiveChat(chatId) {
    activeChat.value = chatId ? conversations.value.find(c => c.id === chatId) : null
  }

  function sendMessage(text) {
    if (!activeChat.value || !text.trim()) return

    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    // Ajouter le message à la conversation active
    if (!activeChat.value.messages) {
      activeChat.value.messages = []
    }
    activeChat.value.messages.push(newMessage)
    
    // Mettre à jour le dernier message
    activeChat.value.lastMessage = text.trim()
    activeChat.value.timestamp = new Date()

    // Simuler une réponse de l'AI
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(),
        sender: 'ai',
        timestamp: new Date(),
        status: 'received'
      }
      activeChat.value.messages.push(aiResponse)
      activeChat.value.lastMessage = aiResponse.text
      activeChat.value.timestamp = new Date()
    }, 1000)
  }

  function generateAIResponse() {
    const responses = [
      "That's fascinating! Tell me more.",
      "I'd love to hear more about that!",
      "How interesting! What else do you enjoy?",
      "That's really cool! What got you interested in that?",
      "I can see why you'd enjoy that. Tell me more!"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return {
    activeChat,
    conversations,
    setActiveChat,
    sendMessage
  }
})