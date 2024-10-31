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

// Handle touch events explicitly
function handleMobileMenuClick() {
  showMobileMenu.value = !showMobileMenu.value
}

function handleSettingsClick() {
  showSettings.value = true
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
    <header 
      class="lg:hidden fixed top-0 left-0 right-0 bg-dark-secondary z-50 px-4 py-3 flex justify-between items-center"
      :style="{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '0.75rem'
      }"
    >
      <h1 class="text-xl font-bold">NPJ</h1>
      <button 
        @click="handleMobileMenuClick" 
        class="p-2 touch-manipulation"
      >
        <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
        <XMarkIcon v-else class="w-6 h-6" />
      </button>
    </header>

    <!-- Conversation List - Desktop -->
    <ConversationList 
      class="hidden lg:block w-1/3 border-r border-dark-hover" 
    />

    <!-- Conversation List - Mobile Slide-over -->
    <div 
      v-if="showMobileMenu"
      class="lg:hidden fixed inset-0 bg-dark-bg z-40"
      style="top: calc(3rem + env(safe-area-inset-top))"
    >
      <ConversationList 
        class="h-full pb-16"
        @chat-selected="showMobileMenu = false"
      />
    </div>

    <!-- Chat Window -->
    <main 
      class="w-full lg:w-2/3 lg:pt-0 lg:pb-0"
      :class="{ 'hidden': showMobileMenu }"
      style="
        padding-top: calc(3rem + env(safe-area-inset-top));
        padding-bottom: calc(4rem + env(safe-area-inset-bottom));
      "
    >
      <ChatWindow 
        v-if="chatStore.activeChat" 
      />
      <div 
        v-else 
        class="h-full flex items-center justify-center text-text-secondary"
      >
        <div class="text-center p-4">
<<<<<<< HEAD
          <h2 class="text-2xl font-semibold mb-2">Welcome PNJ</h2>
=======
          <h2 class="text-2xl font-semibold mb-2">Welcome to JAY</h2>
>>>>>>> a31dddb (v00)
        </div>
      </div>
    </main>

    <!-- Mobile Navigation -->
    <nav 
      class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-secondary border-t border-dark-hover z-50"
      style="padding-bottom: env(safe-area-inset-bottom)"
    >
      <div class="flex justify-around items-center h-16">
        <button 
          class="p-2 rounded-lg transition-colors touch-manipulation"
          :class="chatStore.activeChat ? 'text-text-secondary' : 'text-primary'"
          @click="chatStore.setActiveChat(null)"
        >
          <ChatBubbleLeftIcon class="w-6 h-6" />
        </button>
        <button 
          class="p-2 rounded-lg text-text-secondary hover:text-primary transition-colors touch-manipulation"
          @click="handleSettingsClick"
        >
          <Cog6ToothIcon class="w-6 h-6" />
        </button>
        <button 
          class="p-2 rounded-lg text-text-secondary hover:text-primary transition-colors touch-manipulation"
        >
          <UserIcon class="w-6 h-6" />
        </button>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.touch-manipulation {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  user-select: none;
}

/* Prevent content scrolling when menu is open */
:deep(.no-scroll) {
  overflow: hidden;
  position: fixed;
  width: 100%;
}

/* Ensure proper iOS safe area handling */
@supports(padding: env(safe-area-inset-bottom)) {
  .safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>