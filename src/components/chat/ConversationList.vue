<script setup>
import { ref, computed } from 'vue'
import { useChatStore } from '../../stores/chat'
import { format } from 'date-fns'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const chatStore = useChatStore()
const searchQuery = ref('')

const filteredConversations = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return chatStore.sortedConversations.filter(chat => 
    chat.name.toLowerCase().includes(query) ||
    chat.lastMessage.toLowerCase().includes(query)
  )
})

const formatTime = (date) => {
  if (!date) return ''
  return format(new Date(date), 'HH:mm')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Barre de recherche -->
    <div class="p-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search or start new chat"
          class="input-field pl-10"
        />
        <MagnifyingGlassIcon 
          class="w-5 h-5 text-text-secondary absolute left-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>

    <!-- Liste des conversations -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in filteredConversations"
        :key="chat.id"
        @click="chatStore.setActiveChat(chat.id)"
        class="p-4 hover:bg-dark-hover cursor-pointer transition-colors duration-150"
        :class="{ 'bg-dark-hover': chatStore.activeChat?.id === chat.id }"
      >
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img 
              :src="chat.avatar" 
              class="w-12 h-12 rounded-full"
              :alt="chat.name"
            />
            <div
              v-if="chat.status === 'online'"
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-secondary"
            ></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-semibold text-text-primary truncate">{{ chat.name }}</h3>
              <span class="text-xs text-text-secondary ml-2">
                {{ formatTime(chat.timestamp) }}
              </span>
            </div>
            <p class="text-text-secondary text-sm truncate">{{ chat.lastMessage }}</p>
          </div>

          <div v-if="chat.unread" class="ml-2">
            <span class="bg-accent-primary text-white text-xs px-2 py-1 rounded-full">
              {{ chat.unread }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>