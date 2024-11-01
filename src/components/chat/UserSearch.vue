// src/components/chat/UserSearch.vue
<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useChatStore } from '../../stores/chat'
import { dbUtils } from '../../firebase/utils'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)
const error = ref(null)

const emit = defineEmits(['close', 'select-user'])

watch(searchQuery, async (newQuery) => {
  if (newQuery.length < 3) {
    searchResults.value = []
    return
  }
  
  try {
    isLoading.value = true
    error.value = null
    
    // Search users in Firestore
    const results = await dbUtils.searchUsers(newQuery, authStore.user.uid)
    searchResults.value = results
  } catch (err) {
    error.value = err.message
    console.error('Error searching users:', err)
  } finally {
    isLoading.value = false
  }
}, { debounce: 300 })

async function handleUserSelect(user) {
  try {
    isLoading.value = true
    
    // Check if conversation exists
    const existingConv = chatStore.conversations.find(conv => 
      conv.participants.some(p => p.uid === user.uid)
    )
    
    if (existingConv) {
      emit('select-user', existingConv.id)
    } else {
      // Start new conversation
      const result = await chatStore.startConversation(user.uid)
      if (result.success) {
        emit('select-user', result.conversationId)
      } else {
        throw new Error(result.error)
      }
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
    
    <div class="relative bg-dark-secondary rounded-lg w-full max-w-md">
      <!-- Header -->
      <div class="p-4 border-b border-border-color flex justify-between items-center">
        <h2 class="text-lg font-semibold">Start a Conversation</h2>
        <button 
          @click="$emit('close')"
          class="text-text-secondary hover:text-text-primary"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
      
      <!-- Search Input -->
      <div class="p-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="input-field w-full pl-10"
            :disabled="isLoading"
          />
          <span 
            class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          >
            search
          </span>
        </div>
      </div>
      
      <!-- Results -->
      <div class="max-h-96 overflow-y-auto p-4 space-y-4">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>
        
        <!-- Empty State -->
        <div 
          v-else-if="searchQuery.length >= 3 && searchResults.length === 0" 
          class="text-text-secondary text-center py-8"
        >
          No users found
        </div>
        
        <!-- Results List -->
        <button
          v-else
          v-for="user in searchResults"
          :key="user.uid"
          class="w-full p-3 rounded-lg hover:bg-dark-hover transition-colors flex items-center space-x-3"
          @click="handleUserSelect(user)"
        >
          <img 
            :src="user.avatar" 
            :alt="user.name"
            class="avatar avatar-md"
          />
          <div class="text-left">
            <h3 class="font-medium">{{ user.name }}</h3>
            <p class="text-sm text-text-secondary">{{ user.profile?.bio || 'No bio' }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>