<script setup>
import { ref } from 'vue'
import { useChatStore } from '../store/chat'
import ConversationList from '../components/ConversationList.vue'
import ChatWindow from '../components/ChatWindow.vue'

const chatStore = useChatStore()
</script>

<template>
  <div class="h-screen flex bg-dark-bg">
    <ConversationList class="w-1/3 border-r border-dark-hover" />
    <ChatWindow v-if="chatStore.activeChat" class="w-2/3" />
    <div v-else class="w-2/3 flex items-center justify-center text-text-secondary">
      <div class="text-center">
        <h2 class="text-2xl font-semibold mb-2">Welcome to NPC Chat</h2>
        <p>Select a conversation to start chatting</p>
      </div>
    </div>
  </div>
</template>