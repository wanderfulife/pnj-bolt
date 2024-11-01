<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'
import { useWindowSize } from '../composables/useWindowSize'
import { useBackButton } from '../composables/useBackButton'
import ConversationList from '../components/chat/ConversationList.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import ProfileDrawer from '../components/profile/ProfileDrawer.vue'
import UserProfile from '../components/profile/UserProfile.vue'

const chatStore = useChatStore()
const userStore = useUserStore()
const { width } = useWindowSize()
const { handleBackButton } = useBackButton()

const showUserProfile = ref(false)
const showContactProfile = ref(false)
const isMobileView = computed(() => width.value < 768)
const isLayoutMounted = ref(false)

onMounted(() => {
  isLayoutMounted.value = true
  if (window?.Capacitor) {
    handleBackButton(handleBackNavigation)
  }
})

function handleBackNavigation() {
  if (showUserProfile.value) {
    showUserProfile.value = false
    return true
  }
  if (showContactProfile.value) {
    showContactProfile.value = false
    return true
  }
  if (chatStore.activeChat && isMobileView.value) {
    handleBackToList()
    return true
  }
  return false
}

function handleChatSelect(chatId) {
  chatStore.setActiveChat(chatId)
  if (isMobileView.value) {
    toggleMobileView('chat')
  }
}

function handleBackToList() {
  if (isMobileView.value) {
    toggleMobileView('list')
  }
  chatStore.setActiveChat(null)
}

function toggleMobileView(view) {
  const conversationList = document.querySelector('.conversation-list')
  const chatWindow = document.querySelector('.chat-window')
  if (conversationList && chatWindow) {
    conversationList.style.display = view === 'list' ? 'block' : 'none'
    chatWindow.style.display = view === 'chat' ? 'flex' : 'none'
  }
}
</script>

<template>
  <div v-if="isLayoutMounted" class="h-screen flex bg-dark-primary">
    <div 
      class="conversation-list w-full md:w-80 lg:w-96 flex-shrink-0 bg-dark-primary border-r border-border-color"
      :class="{'hidden md:block': chatStore.activeChat && isMobileView}"
    >
      <ConversationList 
        @select-chat="handleChatSelect"
        @show-profile="showUserProfile = true"
      />
    </div>

    <div 
      class="chat-window flex-1 md:flex flex-col"
      :class="{'hidden': !chatStore.activeChat && isMobileView}"
    >
      <template v-if="chatStore.activeChat">
        <ChatWindow 
          @show-profile="showContactProfile = true"
          @back="handleBackToList"
        />
      </template>
      <div 
        v-else 
        class="flex-1 hidden md:flex items-center justify-center text-text-secondary"
      >
        <p class="text-lg">Select a conversation to start chatting</p>
      </div>
    </div>

    <Transition name="slide">
      <UserProfile
        v-if="showUserProfile"
        :user="userStore.user"
        @close="showUserProfile = false"
      />
    </Transition>

    <Transition name="slide">
      <ProfileDrawer
        v-if="showContactProfile && chatStore.activeChat"
        :profile="chatStore.activeChat"
        @close="showContactProfile = false"
      />
    </Transition>
  </div>
</template>