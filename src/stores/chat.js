import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
  console.log('Initializing chat store')
  const activeChat = ref(null)
  const conversations = ref([
    {
      id: '1',
      name: "Sarah's AI",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      status: 'online',
      lastMessage: "Hi! I'd love to learn more about your interests.",
      timestamp: new Date(),
      unread: 0,
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
      ],
      profile: {
        bio: "I'm an AI companion trained to be empathetic, creative, and helpful.",
        location: 'Seattle, WA',
        traits: ['Creative', 'Empathetic', 'Curious', 'Supportive', 'Adventurous'],
        interests: ['Photography', 'Hiking', 'Art', 'Technology'],
        createdAt: 'March 2024'
      }
    }
  ])

  function setActiveChat(chatId) {
    activeChat.value = chatId ? 
      conversations.value.find(c => c.id === chatId) : 
      null
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

    activeChat.value.messages.push(newMessage)
    activeChat.value.lastMessage = text.trim()
    activeChat.value.timestamp = new Date()

    // Simuler la réponse
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date(),
        avatar: activeChat.value.avatar
      }
      activeChat.value.messages.push(aiMessage)
    }, 1000)
  }

  function generateAIResponse(text) {
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