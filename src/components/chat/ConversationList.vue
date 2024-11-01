<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useUserStore } from '../../stores/user'
import { formatRelativeTime } from '../../utils/dateUtils'
import { CHAT_TYPES } from '../../constants/chatConstants'

const chatStore = useChatStore()
const userStore = useUserStore()

const activeTab = ref('All')
const searchQuery = ref('')

const tabs = [
  { id: 'All', label: 'All' },
  { id: 'AI', label: 'NPCs' },
  { id: 'Friend', label: 'Friends' }
]

const filteredConversations = computed(() => {
  let filtered = [...chatStore.conversations]
  
  // Filter by tab
  if (activeTab.value !== 'All') {
    filtered = filtered.filter(chat => chat.type === activeTab.value)
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(chat => 
      chat.name.toLowerCase().includes(query) || 
      chat.lastMessage?.toLowerCase().includes(query)
    )
  }
  
  // Sort by timestamp
  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const formatTime = (date) => {
  if (!date) return ''
  return formatRelativeTime(date)
}

defineEmits(['select-chat', 'show-profile'])
</script>

<template>
  <div class="chat-container">
    <!-- Header with Profile -->
    <header class="chat-header">
      <div class="flex items-center space-x-3">
        <img 
          :src="userStore.user.avatar" 
          class="avatar avatar-sm cursor-pointer"
          alt="Profile"
          @click="$emit('show-profile')"
        />
        <div class="text-sm">
          <p class="font-medium">{{ userStore.user.name }}</p>
          <p class="text-text-secondary text-xs">{{ userStore.user.status }}</p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button class="btn btn-secondary p-2">
          <span class="material-icons">add</span>
        </button>
        <button class="btn btn-secondary p-2">
          <span class="material-icons">settings</span>
        </button>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="px-4 py-2">
      <div class="relative">
        <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
          search
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search conversations"
          class="input-field pl-10"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="px-4 py-2 border-b border-border-color">
      <div class="flex space-x-2 overflow-x-auto hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="btn px-4 py-1.5 text-sm font-medium"
          :class="activeTab === tab.id ? 'btn-primary' : 'btn-secondary'"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Conversation List -->
    <div class="chat-content custom-scrollbar">
      <div
        v-for="chat in filteredConversations"
        :key="chat.id"
        @click="$emit('select-chat', chat.id)"
        class="p-3 rounded-xl hover:bg-dark-hover transition-smooth cursor-pointer"
        :class="{ 'bg-dark-hover': chatStore.activeChat?.id === chat.id }"
      >
        <div class="flex items-center space-x-3">
          <!-- Avatar with status -->
          <div class="relative">
            <img 
              :src="chat.avatar" 
              class="avatar avatar-md"
              :alt="chat.name"
            />
            <div
              v-if="chat.status === 'online'"
              class="status-badge status-online absolute bottom-0 right-0"
            ></div>
          </div>
          
          <!-- Chat info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-medium text-text-primary truncate">{{ chat.name }}</h3>
              <span class="text-xs text-text-secondary ml-2 flex-shrink-0">
                {{ formatTime(chat.timestamp) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <p class="text-text-secondary text-sm truncate">
                {{ chat.lastMessage }}
              </p>
              
              <!-- Unread badge -->
              <div 
                v-if="chat.unread" 
                class="ml-2 flex-shrink-0 bg-accent-primary px-2 py-0.5 rounded-full"
              >
                <span class="text-xs text-white">
                  {{ chat.unread }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div 
        v-if="filteredConversations.length === 0" 
        class="flex flex-col items-center justify-center h-48 text-text-secondary"
      >
        <span class="material-icons text-4xl mb-2">search_off</span>
        <p class="text-sm">No conversations found</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>