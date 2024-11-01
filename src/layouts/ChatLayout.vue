<script setup>
import { ref } from 'vue'
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'
import ConversationList from '../components/chat/ConversationList.vue'
import ChatWindow from '../components/chat/ChatWindow.vue'
import ProfileDrawer from '../components/profile/ProfileDrawer.vue'
import UserProfile from '../components/profile/UserProfile.vue'

const chatStore = useChatStore()
const userStore = useUserStore()

const showUserProfile = ref(false)
const showContactProfile = ref(false)
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleProfileClick() {
  showUserProfile.value = true
}

function handleContactProfileClick() {
  showContactProfile.value = true
}
</script>

<template>
  <div class="h-screen flex bg-dark-primary">
    <!-- Sidebar - Liste des conversations -->
    <div 
      class="w-full md:w-80 lg:w-96 flex-shrink-0 bg-dark-secondary border-r border-border-color"
      :class="{'hidden md:block': chatStore.activeChat && !isMobileMenuOpen}"
    >
      <!-- En-tête avec profil utilisateur -->
      <div class="p-4 border-b border-border-color">
        <button 
          @click="handleProfileClick"
          class="flex items-center space-x-3 hover:bg-dark-hover w-full p-2 rounded-lg"
        >
          <img 
            :src="userStore.user.avatar" 
            class="w-10 h-10 rounded-full"
            alt="Your profile"
          />
          <span class="font-medium text-text-primary">{{ userStore.user.name }}</span>
        </button>
      </div>

      <ConversationList 
        @select-chat="isMobileMenuOpen = false"
      />
    </div>

    <!-- Zone principale de chat -->
    <div 
      class="flex-1 flex flex-col"
      :class="{'hidden md:flex': !chatStore.activeChat && isMobileMenuOpen}"
    >
      <ChatWindow 
        v-if="chatStore.activeChat"
        @show-profile="handleContactProfileClick"
      />
      <div 
        v-else 
        class="flex-1 flex items-center justify-center text-text-secondary"
      >
        <p class="text-lg">Select a conversation to start chatting</p>
      </div>
    </div>

    <!-- Profil utilisateur -->
    <UserProfile
      v-if="showUserProfile"
      :user="userStore.user"
      @close="showUserProfile = false"
    />

    <!-- Profil contact -->
    <ProfileDrawer
      v-if="showContactProfile && chatStore.activeChat"
      :profile="chatStore.activeChat"
      @close="showContactProfile = false"
    />
  </div>
</template>