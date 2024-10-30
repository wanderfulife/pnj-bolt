<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatStore } from '../store/chat'
import Message from './Message.vue'
import ProfileDrawer from './ProfileDrawer.vue'
import { 
  PaperAirplaneIcon, 
  EllipsisVerticalIcon,
  UserCircleIcon,
  ArrowLeftIcon
} from '@heroicons/vue/24/solid'

const chatStore = useChatStore()
const newMessage = ref('')
const showProfile = ref(false)
const messageContainer = ref(null)

function sendMessage() {
  if (!newMessage.value.trim()) return
  chatStore.sendMessage(newMessage.value)
  newMessage.value = ''
}

function toggleProfile() {
  showProfile.value = !showProfile.value
}

function scrollToBottom() {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(() => chatStore.activeChat?.messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })
</script>

<template>
  <div class="h-full flex flex-col bg-dark-bg relative">
    <!-- Header -->
    <div class="p-4 bg-dark-secondary flex items-center justify-between shadow-md">
      <div class="flex items-center flex-1">
        <button 
          class="mr-2 lg:hidden text-text-secondary"
          @click="chatStore.setActiveChat(null)"
        >
          <ArrowLeftIcon class="w-6 h-6" />
        </button>
        <img :src="chatStore.activeChat.avatar" class="w-10 h-10 rounded-full" />
        <div class="ml-4">
          <h2 class="font-semibold text-text-primary">{{ chatStore.activeChat.name }}</h2>
          <p class="text-sm text-text-secondary" v-if="chatStore.activeChat.online">Online</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleProfile"
          class="text-text-secondary hover:text-text-primary transition-colors"
        >
          <UserCircleIcon class="w-6 h-6" />
        </button>
        <button class="text-text-secondary hover:text-text-primary transition-colors">
          <EllipsisVerticalIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="messageContainer"
      class="flex-1 p-4 overflow-y-auto bg-dark-bg"
    >
      <Message 
        v-for="message in chatStore.activeChat.messages" 
        :key="message.id" 
        :message="message"
      />
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-dark-secondary">
      <div class="flex items-center bg-dark-hover rounded-lg">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="flex-1 px-4 py-3 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="p-2 mx-2 text-primary hover:text-secondary transition-colors"
          :disabled="!newMessage.trim()"
        >
          <PaperAirplaneIcon class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Profile Drawer -->
    <ProfileDrawer 
      :show="showProfile"
      :chat="chatStore.activeChat"
      @close="showProfile = false"
    />
  </div>
</template>