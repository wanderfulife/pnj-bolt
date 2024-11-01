<script setup>
import { ref } from 'vue';
import { useChatStore } from '../../stores/chat';
import { MESSAGE_STATUS } from '../../constants/chatConstants';
import Message from './Message.vue';

const chatStore = useChatStore();
const newMessage = ref('');

const sendMessage = () => {
  if (!newMessage.value.trim()) return;
  chatStore.sendMessage(newMessage.value);
  newMessage.value = '';
};

defineEmits(['show-profile', 'back']);
</script>

<template>
  <div class="chat-container">
    <header class="chat-header">
      <div class="flex items-center space-x-3">
        <button 
          class="md:hidden btn btn-secondary p-2"
          @click="$emit('back')"
        >
          <span class="material-icons">arrow_back</span>
        </button>
        
        <img 
          :src="chatStore.activeChat.avatar" 
          class="avatar avatar-sm"
          :alt="chatStore.activeChat.name"
        />
        
        <div>
          <h2 class="font-medium text-text-primary">{{ chatStore.activeChat.name }}</h2>
          <p class="text-xs text-text-secondary">
            <span v-if="chatStore.activeChat.status === 'online'" class="inline-flex items-center">
              <span class="status-badge status-online mr-1"></span>
              Online
            </span>
            <span v-else>Offline</span>
          </p>
        </div>
      </div>

      <button 
        @click="$emit('show-profile')"
        class="btn btn-secondary p-2"
      >
        <span class="material-icons">info</span>
      </button>
    </header>

    <div class="chat-content custom-scrollbar">
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

    <footer class="chat-footer safe-bottom">
      <div class="flex items-center space-x-2">
        <button class="btn btn-secondary p-2">
          <span class="material-icons">mood</span>
        </button>

        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="input-field"
          @keyup.enter="sendMessage"
        />

        <button
          @click="sendMessage"
          class="btn btn-primary p-2"
          :disabled="!newMessage.trim()"
        >
          <span class="material-icons">send</span>
        </button>
      </div>
    </footer>
  </div>
</template>