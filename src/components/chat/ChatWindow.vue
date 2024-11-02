// ChatWindow.vue - Version optimisée
<script setup>
import { ref, computed, watchEffect, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/services/notificationService'
import Message from './Message.vue'
import Avatar from '../shared/Avatar.vue'

// Stores
const chatStore = useChatStore()
const authStore = useAuthStore()
const notifications = useNotifications()

// Refs
const messageInput = ref('')
const messageContainer = ref(null)
const isTyping = ref(false)
const typingTimeout = ref(null)

// Computed
const canSendMessage = computed(() => 
  messageInput.value.trim().length > 0 && !chatStore.isLoading
)

const otherParticipant = computed(() => 
  chatStore.activeConversation?.participants.find(
    p => p.uid !== authStore.user.uid
  )
)

// Methods
function handleTyping() {
  if (typingTimeout.value) clearTimeout(typingTimeout.value)
  isTyping.value = true
  
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false
  }, 3000)
}

async function sendMessage() {
  if (!canSendMessage.value) return

  try {
    const message = messageInput.value.trim()
    messageInput.value = ''
    
    await chatStore.sendMessage({
      text: message,
      conversationId: chatStore.activeConversation.id
    })
    
    // Scroll to bottom après l'envoi
    await nextTick()
    scrollToBottom()
  } catch (error) {
    notifications.error('Failed to send message')
    console.error('Send message error:', error)
  }
}

function scrollToBottom() {
  if (!messageContainer.value) return
  
  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

// Watchers & Lifecycle
watchEffect(() => {
  if (chatStore.messages.length) {
    nextTick(scrollToBottom)
  }
})

// Nettoyage
onBeforeUnmount(() => {
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }
})

// Émits
defineEmits(['show-profile', 'back'])
</script>

<template>
  <div class="chat-container">
    <!-- Header -->
    <header class="chat-header">
      <div class="flex items-center space-x-3">
        <button 
          class="md:hidden btn btn-secondary p-2"
          @click="$emit('back')"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        
        <Avatar
          v-if="otherParticipant"
          :src="otherParticipant.avatar"
          :alt="otherParticipant.name"
          size="sm"
          :status="otherParticipant.status"
          @click="$emit('show-profile')"
        />
        
        <div>
          <h2 class="font-medium">{{ otherParticipant?.name }}</h2>
          <p class="text-xs text-text-secondary">
            {{ otherParticipant?.status === 'online' ? 'Online' : 'Offline' }}
          </p>
        </div>
      </div>

      <button 
        @click="$emit('show-profile')"
        class="btn btn-secondary p-2"
      >
        <span class="material-icons">info</span>
      </button>
    </header>

    <!-- Messages -->
    <div 
      ref="messageContainer"
      class="chat-content custom-scrollbar"
    >
      <div 
        v-if="!chatStore.messages.length" 
        class="flex flex-col items-center justify-center h-full text-text-secondary"
      >
        <span class="material-icons text-4xl mb-2">chat</span>
        <p>Start a conversation</p>
      </div>
      
      <TransitionGroup 
        name="message"
        tag="div"
        class="space-y-4"
      >
        <Message
          v-for="message in chatStore.messages"
          :key="message.id"
          :message="message"
          :is-own="message.senderId === authStore.user.uid"
        />
      </TransitionGroup>

      <div 
        v-if="isTyping"
        class="flex items-center space-x-2 text-text-secondary p-2"
      >
        <div class="typing-indicator" />
        <span class="text-sm">{{ otherParticipant?.name }} is typing...</span>
      </div>
    </div>

    <!-- Input -->
    <footer class="chat-footer safe-bottom">
      <div class="flex items-center space-x-2">
        <button class="btn btn-secondary p-2">
          <span class="material-icons">add_photo_alternate</span>
        </button>

        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message"
          class="input-field flex-1"
          @input="handleTyping"
          @keyup.enter="sendMessage"
        />

        <button
          class="btn btn-primary p-2"
          :disabled="!canSendMessage"
          @click="sendMessage"
        >
          <span class="material-icons">send</span>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.message-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.typing-indicator {
  @apply w-3 h-3 bg-text-secondary rounded-full;
  animation: bounce 0.8s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.dark-hover') transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  @apply w-1.5;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-dark-hover rounded-full;
}
</style>