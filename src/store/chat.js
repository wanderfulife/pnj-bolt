import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([
    {
      id: '1',
      name: 'Alice NPC',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice&backgroundColor=b6e3f4',
      lastMessage: 'Hey there! How are you?',
      timestamp: new Date(),
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: 'Hey there!', sender: 'Alice NPC', timestamp: new Date(Date.now() - 3600000), type: 'received' },
        { id: 2, text: 'How are you?', sender: 'Alice NPC', timestamp: new Date(), type: 'received' }
      ]
    },
    {
      id: '2',
      name: 'Bob NPC',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob&backgroundColor=ffd5dc',
      lastMessage: 'Looking forward to our chat!',
      timestamp: new Date(Date.now() - 1800000),
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'Looking forward to our chat!', sender: 'Bob NPC', timestamp: new Date(Date.now() - 1800000), type: 'received' }
      ]
    }
  ])

  const activeChat = ref(null)

  function setActiveChat(chatId) {
    const chat = conversations.value.find(c => c.id === chatId)
    if (chat) {
      chat.unread = 0
      activeChat.value = chat
    }
  }

  function sendMessage(text) {
    if (!activeChat.value || !text.trim()) return

    const newMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'You',
      timestamp: new Date(),
      type: 'sent'
    }

    activeChat.value.messages.push(newMessage)
    activeChat.value.lastMessage = text.trim()
    activeChat.value.timestamp = new Date()

    // Simulate NPC response after a short delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I see what you mean!",
        "How fascinating! I'd love to hear your thoughts on that.",
        "That's a great point!",
        "I never thought about it that way before."
      ]
      const responseMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: activeChat.value.name,
        timestamp: new Date(),
        type: 'received'
      }
      activeChat.value.messages.push(responseMessage)
      activeChat.value.lastMessage = responseMessage.text
      activeChat.value.timestamp = new Date()
    }, 1000 + Math.random() * 2000)
  }

  return {
    conversations,
    activeChat,
    setActiveChat,
    sendMessage
  }
})