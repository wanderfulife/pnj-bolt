<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../store/chat'
import ConversationList from '../components/ConversationList.vue'
import ChatWindow from '../components/ChatWindow.vue'
import MobileNavigation from '../components/MobileNavigation.vue'
import { XMarkIcon, Bars3Icon } from '@heroicons/vue/24/solid'

const chatStore = useChatStore()
const showMobileMenu = ref(false)
const showSettings = ref(false)

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function handleResize() {
  if (window.innerWidth >= 1024) {
    showMobileMenu.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div class="h-screen flex bg-dark-bg">
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-dark-secondary z-10 px-4 py-3 flex justify-between items-center">
      <h1 class="text-xl font-bold">NPC Chat</h1>
      <button @click="toggleMobileMenu" class="p-2">
        <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Conversation List - Desktop -->
    <ConversationList 
      class="hidden lg:block w-1/3 border-r border-dark-hover" 
    />

    <!-- Conversation List - Mobile Slide-over -->
    <div 
      v-if="showMobileMenu"
      class="lg:hidden fixed inset-0 bg-dark-bg z-20"
    >
      <ConversationList 
        class="h-full pt-16 pb-16"
        @chat-selected="showMobileMenu = false"
      />
    </div>

    <!-- Chat Window -->
    <div 
      class="w-full lg:w-2/3 pt-16 pb-16 lg:pt-0 lg:pb-0"
      :class="{ 'hidden': showMobileMenu }"
    >
      <ChatWindow 
        v-if="chatStore.activeChat" 
      />
      <div 
        v-else 
        class="h-full flex items-center justify-center text-text-secondary"
      >
        <div class="text-center p-4">
          <h2 class="text-2xl font-semibold mb-2">Welcome to NPC Chat</h2>
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <MobileNavigation @open-settings="showSettings = true" />
  </div>
</template>
