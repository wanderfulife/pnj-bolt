<script setup>
import { useChatStore } from '../store/chat'
import { format } from 'date-fns'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

const chatStore = useChatStore()
const searchQuery = ref('')

const emit = defineEmits(['chat-selected'])

function selectChat(chatId) {
  chatStore.setActiveChat(chatId)
  emit('chat-selected')
}
</script>

<template>
  <div class="h-full flex flex-col bg-dark-secondary">
    <!-- Header -->
    <div class="p-4 bg-dark-bg lg:block">
      <h1 class="text-xl font-bold mb-4 hidden lg:block">NPC Chat</h1>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search or start new chat"
          class="w-full bg-dark-hover text-text-primary placeholder-text-secondary py-2 px-4 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <MagnifyingGlassIcon class="w-5 h-5 text-text-secondary absolute left-3 top-2.5" />
      </div>
    </div>
    
    <!-- Conversations List -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in chatStore.conversations"
        :key="chat.id"
        @click="selectChat(chat.id)"
        class="p-4 hover:bg-dark-hover cursor-pointer transition-colors duration-150"
        :class="{ 'bg-dark-hover': chatStore.activeChat?.id === chat.id }"
      >
        <div class="flex items-center">
          <div class="relative">
            <img :src="chat.avatar" class="w-12 h-12 rounded-full" />
            <div
              v-if="chat.online"
              class="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-dark-secondary"
            ></div>
          </div>
          <div class="ml-4 flex-1 min-w-0">
            <div class="flex justify-between items-baseline">
              <h3 class="font-semibold text-text-primary truncate">{{ chat.name }}</h3>
              <span class="text-xs text-text-secondary whitespace-nowrap ml-2">
                {{ format(chat.timestamp, 'HH:mm') }}
              </span>
            </div>
            <p class="text-text-secondary text-sm truncate">{{ chat.lastMessage }}</p>
          </div>
          <div
            v-if="chat.unread"
            class="ml-2 bg-primary text-dark-bg rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
          >
            {{ chat.unread }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>