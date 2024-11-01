<script setup>
import { ref } from 'vue';
import { useChatStore } from '../../stores/chat';
import Message from './Message.vue';

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
    <!-- En-tête de conversation -->
    <header class="px-4 py-3 bg-dark-secondary border-b border-border-color flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img 
          :src="chatStore.activeChat.avatar" 
          class="w-8 h-8 rounded-full"
          :alt="chatStore.activeChat.name"
        />
        <div>
          <h2 class="font-medium text-text-primary">{{ chatStore.activeChat.name }}</h2>
          <p class="text-xs text-text-secondary">
            <span v-if="chatStore.activeChat.status === 'online'" class="inline-flex items-center">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
              Online
            </span>
            <span v-else>Offline</span>
          </p>
        </div>
      </div>

      <!-- Bouton info -->
      <button 
        @click="$emit('show-profile')"
        class="p-2 rounded-full hover:bg-dark-hover transition-colors"
      >
        <span class="material-icons text-text-secondary">info</span>
      </button>
    </header>

    <!-- Zone des messages -->
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

    <!-- Zone de saisie -->
    <div class="p-4 border-t border-border-color bg-dark-secondary">
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-full hover:bg-dark-hover text-text-secondary">
          <span class="material-icons">mood</span>
        </button>

        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="flex-1 bg-dark-hover rounded-full px-4 py-2 text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
          @keyup.enter="sendMessage"
        />

        <button
          @click="sendMessage"
          class="p-2 rounded-full bg-accent-primary hover:bg-accent-secondary text-white disabled:opacity-50 transition-colors"
          :disabled="!newMessage.trim()"
        >
          <span class="material-icons">send</span>
        </button>
      </div>
    </div>
  </div>
</template>