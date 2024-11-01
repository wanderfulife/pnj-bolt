<script setup>
import { ref, onMounted, watch } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useAuthStore } from '../../stores/auth'
import { dbUtils } from '../../firebase/utils'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import Message from './Message.vue'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const chatStore = useChatStore()
const authStore = useAuthStore()
const newMessage = ref('')
const messages = ref([])
const isLoading = ref(false)

let unsubscribeMessages = null

onMounted(() => {
  if (chatStore.activeConversation) {
    subscribeToMessages()
  }
})

watch(() => chatStore.activeConversation, (newConversation) => {
  if (unsubscribeMessages) {
    unsubscribeMessages()
  }
  if (newConversation) {
    subscribeToMessages()
  }
})

function subscribeToMessages() {
  unsubscribeMessages = dbUtils.listenToMessages(
    chatStore.activeConversation.id,
    (updatedMessages) => {
      messages.value = updatedMessages
    }
  )
}

async function sendMessage() {
  if (!newMessage.value.trim() || !chatStore.activeConversation) return

  try {
    isLoading.value = true
    const messageData = {
      text: newMessage.value.trim(),
      senderId: authStore.user.uid,
      senderName: authStore.user.name,
      senderAvatar: authStore.user.avatar,
      timestamp: serverTimestamp(),
      status: 'sent'
    }

    await dbUtils.sendMessage(chatStore.activeConversation.id, messageData)
    newMessage.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isLoading.value = false
  }
}

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
        
        <img 
          :src="chatStore.activeConversation?.participants.find(p => p.uid !== authStore.user.uid)?.avatar" 
          class="avatar avatar-sm"
          :alt="chatStore.activeConversation?.participants.find(p => p.uid !== authStore.user.uid)?.name"
        />
        
        <div>
          <h2 class="font-medium text-text-primary">
            {{ chatStore.activeConversation?.participants.find(p => p.uid !== authStore.user.uid)?.name }}
          </h2>
          <p class="text-xs text-text-secondary">
            <span v-if="chatStore.activeConversation?.isOnline" class="inline-flex items-center">
              <span class="status-badge status-online mr-1"></span>
              Online
            </span>
            <span v-else>Offline</span>
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
    <div class="chat-content custom-scrollbar" ref="messageContainer">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-text-secondary">
        <span class="material-icons text-4xl mb-2">chat</span>
        <p>Start a conversation</p>
      </div>
      
      <Message 
        v-else
        v-for="(message, index) in messages"
        :key="message.id"
        :message="message"
        :isFirstInGroup="index === 0 || 
          messages[index - 1].senderId !== message.senderId"
        :isLastInGroup="index === messages.length - 1 || 
          messages[index + 1].senderId !== message.senderId"
      />
    </div>

    <!-- Input -->
    <footer class="chat-footer safe-bottom">
      <div class="flex items-center space-x-2">
        <button class="btn btn-secondary p-2">
          <span class="material-icons">mood</span>
        </button>

        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="input-field"
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        />

        <button
          @click="sendMessage"
          class="btn btn-primary p-2"
          :disabled="isLoading || !newMessage.trim()"
        >
          <LoadingSpinner v-if="isLoading" size="sm" color="white" />
          <span v-else class="material-icons">send</span>
        </button>
      </div>
    </footer>
  </div>
</template>
