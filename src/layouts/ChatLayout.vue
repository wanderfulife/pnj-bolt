// src/layouts/ChatLayout.vue
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../stores/chat'
import { useAuthStore } from '../stores/auth'
import { useWindowSize } from '../composables/useWindowSize'
import ConversationList from '../components/chat/ConversationList.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import UserProfile from '../components/profile/UserProfile.vue'
import UserSearch from '../components/chat/UserSearch.vue'
import { useRouter } from 'vue-router'

const chatStore = useChatStore()
const authStore = useAuthStore()
const router = useRouter()
const { width } = useWindowSize()

const showUserProfile = ref(false)
const showUserSearch = ref(false)
const isMobileView = computed(() => width.value < 768)
const isLayoutMounted = ref(false)

onMounted(() => {
  isLayoutMounted.value = true
  
  // Check authentication
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  // Initialize chat
  chatStore.initializeListeners()
})

onUnmounted(() => {
  chatStore.cleanup()
})

function handleChatSelect(conversationId) {
  chatStore.setActiveConversation(conversationId)
  if (isMobileView.value) {
    toggleMobileView('chat')
  }
}

function handleUserSelect(conversationId) {
  showUserSearch.value = false
  handleChatSelect(conversationId)
}

function handleBackToList() {
  if (isMobileView.value) {
    toggleMobileView('list')
  }
  chatStore.setActiveConversation(null)
}

function toggleMobileView(view) {
  const conversationList = document.querySelector('.conversation-list')
  const chatWindow = document.querySelector('.chat-window')
  
  if (conversationList && chatWindow) {
    conversationList.style.display = view === 'list' ? 'block' : 'none'
    chatWindow.style.display = view === 'chat' ? 'flex' : 'none'
  }
}

// Add transitions for mobile navigation
function handleMobileTransition(view) {
  const container = document.querySelector('.mobile-container')
  if (container) {
    container.classList.remove('slide-left', 'slide-right')
    container.classList.add(view === 'chat' ? 'slide-left' : 'slide-right')
  }
}
</script>

<template>
  <div v-if="isLayoutMounted" class="h-screen flex bg-dark-primary">
    <!-- Conversation List -->
    <div 
      class="conversation-list w-full md:w-80 lg:w-96 flex-shrink-0 bg-dark-primary border-r border-border-color"
      :class="{'hidden md:block': chatStore.activeConversation && isMobileView}"
    >
      <ConversationList 
        @select-chat="handleChatSelect"
        @show-profile="showUserProfile = true"
        @new-chat="showUserSearch = true"
      />
    </div>

    <!-- Chat Window -->
    <div 
      class="chat-window flex-1 md:flex flex-col"
      :class="{'hidden': !chatStore.activeConversation && isMobileView}"
    >
      <template v-if="chatStore.activeConversation">
        <ChatWindow 
          @back="handleBackToList"
          @show-profile="showContactProfile = true"
        />
      </template>
      <div 
        v-else 
        class="flex-1 hidden md:flex items-center justify-center text-text-secondary flex-col space-y-4"
      >
        <div class="text-center">
          <span class="material-icons text-6xl mb-4">chat</span>
          <p class="text-lg">Select a conversation or start a new one</p>
        </div>
        <button 
          @click="showUserSearch = true"
          class="btn btn-primary"
        >
          Start New Chat
        </button>
      </div>
    </div>

    <!-- User Profile Drawer -->
    <Transition name="slide">
      <UserProfile
        v-if="showUserProfile"
        @close="showUserProfile = false"
      />
    </Transition>

    <!-- User Search Modal -->
    <Transition name="fade">
      <UserSearch
        v-if="showUserSearch"
        @close="showUserSearch = false"
        @select-user="handleUserSelect"
      />
    </Transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile transitions */
.slide-left {
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.slide-right {
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}
</style>