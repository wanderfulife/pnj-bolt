<script setup>
import { ref } from 'vue';
import Message from './Message.vue';
import { useChatStore } from '../../stores/chat';

const chatStore = useChatStore();
const newMessage = ref('');

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  chatStore.sendMessage(newMessage.value);
  newMessage.value = '';
};

defineEmits(['show-profile']);
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <header class="chat-header">
      <div class="flex items-center flex-1 cursor-pointer" @click="$emit('show-profile')">
        <img 
          :src="chatStore.activeChat.avatar" 
          class="w-10 h-10 rounded-full"
          :alt="chatStore.activeChat.name"
        />
        <div class="ml-3">
          <h2 class="font-medium">{{ chatStore.activeChat.name }}</h2>
          <p class="text-sm text-text-secondary">{{ chatStore.activeChat.status }}</p>
        </div>
      </div>
    </header>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <Message 
        v-for="(message, index) in chatStore.activeChat.messages"
        :key="message.id"
        :message="message"
        :isFirstInGroup="index === 0 || 
          chatStore.activeChat.messages[index - 1].sender !== message.sender"
        :isLastInGroup="index === chatStore.activeChat.messages.length - 1 || 
          chatStore.activeChat.messages[index + 1].sender !== message.sender"
      />
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-border-color bg-dark-secondary">
      <div class="flex items-center gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="input-field"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="p-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-white disabled:opacity-50 transition-colors"
          :disabled="!newMessage.trim()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>