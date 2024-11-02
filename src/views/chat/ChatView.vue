<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useAuthStore } from '../../stores/auth'
import ConversationList from '../../components/chat/ConversationList.vue'
import ChatWindow from '../../components/chat/ChatWindow.vue'
import UserProfile from '../../components/profile/UserProfile.vue'
import UserSearch from '../../components/chat/UserSearch.vue'
import ProfileDrawer from '../../components/profile/ProfileDrawer.vue'
import { useWindowSize } from '@vueuse/core'

const chatStore = useChatStore()
const authStore = useAuthStore()
const { width } = useWindowSize()

const showUserProfile = ref(false)
const showContactProfile = ref(false)
const showUserSearch = ref(false)
const isMobileView = computed(() => width.value < 768)

// Handle conversation selection
function handleChatSelect(conversationId) {
  chatStore.setActiveConversation(conversationId)
  if (isMobileView.value) {
    hideMobileList()
  }
}

function handleUserSelect(conversationId) {
  showUserSearch.value = false
  handleChatSelect(conversationId)
}

// Mobile view handlers
function showMobileList() {
  const list = document.querySelector('.conversation-list')
  const chat = document.querySelector('.chat-window')
  if (list && chat) {
    list.style.display = 'block'
    chat.style.display = 'none'
  }
}

function hideMobileList() {
  const list = document.querySelector('.conversation-list')
  const chat = document.querySelector('.chat-window')
  if (list && chat) {
    list.style.display = 'none'
    chat.style.display = 'flex'
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  chatStore.cleanup()
})
</script>

<template>
  <div class="h-screen bg-dark-primary flex">
    <!-- Conversation List -->
    <div 
      class="conversation-list w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-border-color"
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
      class="chat-window flex-1 flex-col"
      :class="{'hidden md:flex': !chatStore.activeConversation && isMobileView}"
    >
      <template v-if="chatStore.activeConversation">
        <ChatWindow 
          :conversation="chatStore.activeConversation"
          @back="showMobileList"
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

    <!-- Contact Profile Drawer -->
    <Transition name="slide">
      <ProfileDrawer
        v-if="showContactProfile"
        :profile="chatStore.activeConversation?.participants.find(p => p.uid !== authStore.user.uid)"
        @close="showContactProfile = false"
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .chat-window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: theme('colors.dark-primary');
  }
}
</style>