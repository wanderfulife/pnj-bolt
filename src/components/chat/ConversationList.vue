// src/components/chat/ConversationList.vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '../../stores/chat'
import { useAuthStore } from '../../stores/auth'
import { formatRelativeTime } from '../../utils/dateUtils'
import { dbUtils } from '../../firebase/utils'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const chatStore = useChatStore()
const authStore = useAuthStore()
const isLoading = ref(true)
const searchQuery = ref('')
const activeTab = ref('All')

const tabs = [
  { id: 'All', label: 'All' },
  { id: 'Unread', label: 'Unread' },
  { id: 'AI', label: 'NPCs' }
]

const filteredConversations = computed(() => {
  let filtered = [...chatStore.conversations]
  
  // Filter by tab
  if (activeTab.value === 'Unread') {
    filtered = filtered.filter(conv => conv.unreadCount > 0)
  } else if (activeTab.value === 'AI') {
    filtered = filtered.filter(conv => conv.type === 'AI')
  }
  
  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(conv => {
      const otherParticipant = conv.participants.find(p => p.uid !== authStore.user.uid)
      return otherParticipant.name.toLowerCase().includes(query) ||
             conv.lastMessage?.text.toLowerCase().includes(query)
    })
  }
  
  return filtered
})

onMounted(async () => {
  try {
    await chatStore.initializeListeners()
  } finally {
    isLoading.value = false
  }
})

function getOtherParticipant(conversation) {
  return conversation.participants.find(p => p.uid !== authStore.user.uid)
}

function formatTime(timestamp) {
  return formatRelativeTime(timestamp)
}

defineEmits(['select-chat', 'show-profile'])
</script>

<template>
  <div class="chat-container">
    <!-- Header -->
    <header class="chat-header">
      <div class="flex items-center space-x-3">
        <img 
          :src="authStore.user.avatar" 
          class="avatar avatar-sm cursor-pointer"
          alt="Profile"
          @click="$emit('show-profile')"
        />
        <div class="text-sm">
          <p class="font-medium">{{ authStore.user.name }}</p>
          <p class="text-text-secondary text-xs">{{ authStore.user.status }}</p>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <button class="btn btn-secondary p-2">
          <span class="material-icons">person_add</span>
        </button>
      </div>
    </header>

    <!-- Search -->
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
          class="btn px-4 py-1.5 text-sm font-medium whitespace-nowrap"
          :class="activeTab === tab.id ? 'btn-primary' : 'btn-secondary'"
        >
          {{ tab.label }}
          <span 
            v-if="tab.id === 'Unread' && chatStore.totalUnread" 
            class="ml-1 text-xs bg-accent-primary px-1.5 py-0.5 rounded-full"
          >
            {{ chatStore.totalUnread }}
          </span>
        </button>
      </div>
    </div>

    <!-- Conversation List -->
    <div class="chat-content custom-scrollbar">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Empty State -->
      <div 
        v-else-if="filteredConversations.length === 0" 
        class="flex flex-col items-center justify-center h-48 text-text-secondary"
      >
        <span class="material-icons text-4xl mb-2">search_off</span>
        <p v-if="searchQuery" class="text-sm">No conversations found</p>
        <p v-else class="text-sm">No conversations yet</p>
        <button 
          class="btn btn-primary mt-4"
          @click="activeTab = 'All'"
        >
          Start a new chat
        </button>
      </div>

      <!-- Conversations -->
      <div
        v-else
        v-for="conversation in filteredConversations"
        :key="conversation.id"
        @click="$emit('select-chat', conversation.id)"
        class="p-3 rounded-xl hover:bg-dark-hover transition-smooth cursor-pointer"
        :class="{ 'bg-dark-hover': chatStore.activeConversation?.id === conversation.id }"
      >
        <div class="flex items-center space-x-3">
          <!-- Avatar with status -->
          <div class="relative">
            <img 
              :src="getOtherParticipant(conversation).avatar" 
              class="avatar avatar-md"
              :alt="getOtherParticipant(conversation).name"
            />
            <div
              v-if="getOtherParticipant(conversation).status === 'online'"
              class="status-badge status-online absolute bottom-0 right-0"
            ></div>
          </div>
          
          <!-- Chat info -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-medium text-text-primary truncate">
                {{ getOtherParticipant(conversation).name }}
              </h3>
              <span class="text-xs text-text-secondary ml-2 flex-shrink-0">
                {{ formatTime(conversation.lastMessage?.timestamp) }}
              </span>
            </div>
            
            <div class="flex justify-between items-center">
              <p class="text-text-secondary text-sm truncate">
                {{ conversation.lastMessage?.text }}
              </p>
              
              <!-- Unread badge -->
              <div 
                v-if="conversation.unreadCount" 
                class="ml-2 flex-shrink-0 bg-accent-primary px-2 py-0.5 rounded-full"
              >
                <span class="text-xs text-white">
                  {{ conversation.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
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