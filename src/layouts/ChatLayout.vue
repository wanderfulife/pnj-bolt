<script setup>
import { ref, onMounted } from 'vue' // Ajout de onMounted
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'
import { App } from '@capacitor/app'
import ConversationList from '../components/chat/ConversationList.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import ProfileDrawer from '../components/profile/ProfileDrawer.vue'
import UserProfile from '../components/profile/UserProfile.vue'

const chatStore = useChatStore()
const userStore = useUserStore()

const showUserProfile = ref(false)
const showContactProfile = ref(false)
const isMobileView = ref(true) // Initialisation par défaut à true
const isLayoutMounted = ref(false) // Nouvel état pour contrôler le montage

onMounted(() => {
  // Initialiser isMobileView correctement
  isMobileView.value = window.innerWidth < 768
  isLayoutMounted.value = true

  window.addEventListener('resize', () => {
    isMobileView.value = window.innerWidth < 768
  })

  if (window?.Capacitor) {
    App.addListener('backButton', ({ canGoBack }) => {
      if (showUserProfile.value) {
        showUserProfile.value = false
        return
      }
      if (showContactProfile.value) {
        showContactProfile.value = false
        return
      }
      if (chatStore.activeChat && isMobileView.value) {
        handleBackToList()
        return
      }
      if (canGoBack) {
        window.history.back()
      } else {
        App.exitApp()
      }
    })
  }
})

function handleChatSelect(chatId) {
  chatStore.setActiveChat(chatId)
  if (isMobileView.value) {
    const conversationList = document.querySelector('.conversation-list')
    const chatWindow = document.querySelector('.chat-window')
    if (conversationList && chatWindow) {
      conversationList.style.display = 'none'
      chatWindow.style.display = 'flex'
    }
  }
}

function handleBackToList() {
  if (isMobileView.value) {
    const conversationList = document.querySelector('.conversation-list')
    const chatWindow = document.querySelector('.chat-window')
    if (conversationList && chatWindow) {
      conversationList.style.display = 'block'
      chatWindow.style.display = 'none'
    }
  }
  chatStore.setActiveChat(null)
}

function handleProfileClick() {
  showUserProfile.value = true
}

function handleContactProfileClick() {
  showContactProfile.value = true
}
</script>

<template>
  <div v-if="isLayoutMounted" class="h-screen flex bg-dark-primary">
    <!-- Liste des conversations -->
    <div class="conversation-list w-full md:w-80 lg:w-96 flex-shrink-0 bg-dark-primary border-r border-border-color">
      <ConversationList 
        @select-chat="handleChatSelect"
        @show-profile="handleProfileClick"
      />
    </div>

    <!-- Zone de chat -->
    <div class="chat-window flex-1 md:flex flex-col" :class="{'hidden': !chatStore.activeChat && isMobileView}">
      <template v-if="chatStore.activeChat">
        <!-- Bouton retour mobile -->
        <div class="md:hidden p-2 bg-dark-secondary border-b border-border-color">
          <button 
            @click="handleBackToList"
            class="flex items-center text-text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
        
        <ChatWindow 
          @show-profile="handleContactProfileClick"
        />
      </template>
      <div 
        v-else 
        class="flex-1 hidden md:flex items-center justify-center text-text-secondary"
      >
        <p class="text-lg">Select a conversation to start chatting</p>
      </div>
    </div>

    <!-- Drawers des profils -->
    <UserProfile
      v-if="showUserProfile"
      :user="userStore.user"
      @close="showUserProfile = false"
    />

    <ProfileDrawer
      v-if="showContactProfile && chatStore.activeChat"
      :profile="chatStore.activeChat"
      @close="showContactProfile = false"
    />
  </div>
</template>

<style scoped>
.conversation-list {
  display: block;
}

@media (max-width: 768px) {
  .chat-window {
    display: none;
  }
}
</style>