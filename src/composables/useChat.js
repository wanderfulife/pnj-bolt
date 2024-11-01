import { ref, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'

export function useChat() {
  const chatStore = useChatStore()
  const userStore = useUserStore()
  
  const isTyping = ref(false)
  const typingTimeout = ref(null)

  const canSendMessage = computed(() => 
    chatStore.activeChat && userStore.isAuthenticated
  )

  function startTyping() {
    isTyping.value = true
    
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
    }
    
    typingTimeout.value = setTimeout(() => {
      isTyping.value = false
    }, 3000)
  }

  function stopTyping() {
    isTyping.value = false
    if (typingTimeout.value) {
      clearTimeout(typingTimeout.value)
    }
  }

  return {
    isTyping,
    canSendMessage,
    startTyping,
    stopTyping
  }
}