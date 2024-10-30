<script setup>
import { ChatBubbleLeftIcon, UserIcon, Cog6ToothIcon } from '@heroicons/vue/24/solid'
import { useChatStore } from '../store/chat'

const chatStore = useChatStore()

defineEmits(['openSettings'])
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-dark-secondary border-t border-dark-hover">
    <div class="flex justify-around items-center h-16">
      <button 
        class="p-2 rounded-lg transition-colors"
        :class="chatStore.activeChat ? 'text-text-secondary' : 'text-primary'"
        @click="chatStore.setActiveChat(null)"
      >
        <ChatBubbleLeftIcon class="w-6 h-6" />
      </button>
      <button 
        class="p-2 rounded-lg text-text-secondary hover:text-primary transition-colors"
        @click="$emit('openSettings')"
      >
        <Cog6ToothIcon class="w-6 h-6" />
      </button>
      <button 
        class="p-2 rounded-lg text-text-secondary hover:text-primary transition-colors"
      >
        <UserIcon class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>