<script setup>
import { ref } from 'vue'
import { useChatStore } from '../../stores/chat'
import { format } from 'date-fns'
import { useUserStore } from '../../stores/user'

const chatStore = useChatStore()
const userStore = useUserStore()

const activeTab = ref('All')
const tabs = [
  { id: 'All', icon: 'chat-bubble-left-right', label: 'All' },
  { id: 'NPCs', icon: 'sparkles', label: 'NPCs' },
  { id: 'Friends', icon: 'user-group', label: 'Friends' }
]

const formatTime = (date) => {
  if (!date) return ''
  return format(new Date(date), 'H:mm')
}

defineEmits(['select-chat'])
</script>

<template>
  <div class="flex flex-col h-full bg-dark-primary">
    <!-- Header with Profile -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img 
          :src="userStore.user.avatar" 
          class="w-8 h-8 rounded-full cursor-pointer"
          alt="Profile"
          @click="$emit('show-profile')"
        />
      </div>
      <div class="flex space-x-2">
        <button class="p-2 rounded-full hover:bg-dark-hover">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
          </svg>
        </button>
        <button class="p-2 rounded-full hover:bg-dark-hover">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 py-2">
      <div class="bg-dark-hover rounded-2xl px-4 py-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-text-secondary" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input
          type="text"
          placeholder="Search chats"
          class="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-text-primary placeholder-text-secondary"
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="px-4 py-2">
      <div class="flex space-x-2 overflow-x-auto hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          :class="activeTab === tab.id ? 'bg-dark-hover text-text-primary' : 'text-text-secondary hover:bg-dark-hover/50'"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- Conversation List -->
    <div class="flex-1 overflow-y-auto px-2">
      <div
        v-for="chat in chatStore.conversations"
        :key="chat.id"
        @click="$emit('select-chat', chat.id)"
        class="p-3 rounded-xl hover:bg-dark-hover active:bg-dark-active cursor-pointer transition-colors duration-150 mb-1"
        :class="{ 'bg-dark-hover': chatStore.activeChat?.id === chat.id }"
      >
        <div class="flex items-center space-x-3">
          <div class="relative flex-shrink-0">
            <img 
              :src="chat.avatar" 
              class="w-12 h-12 rounded-full"
              :alt="chat.name"
            />
            <div
              v-if="chat.status === 'online'"
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark-primary"
            ></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-medium text-text-primary truncate">{{ chat.name }}</h3>
              <span class="text-xs text-text-secondary ml-2 flex-shrink-0">
                {{ formatTime(chat.timestamp) }}
              </span>
            </div>
            <p class="text-text-secondary text-sm truncate">{{ chat.lastMessage }}</p>
          </div>

          <div v-if="chat.unread" class="ml-2 flex-shrink-0">
            <span class="bg-accent-primary text-white text-xs px-2 py-0.5 rounded-full">
              {{ chat.unread }}
            </span>
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