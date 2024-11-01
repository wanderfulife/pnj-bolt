<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { formatMessageTime } from '../../utils/dateUtils'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isFirstInGroup: {
    type: Boolean,
    default: false
  },
  isLastInGroup: {
    type: Boolean,
    default: false
  }
})

const authStore = useAuthStore()
const isOwnMessage = computed(() => props.message.senderId === authStore.user.uid)
const formattedTime = computed(() => formatMessageTime(props.message.timestamp))

const messageClasses = computed(() => ({
  'ml-12': !isOwnMessage.value && !props.isFirstInGroup,
  'mr-12': isOwnMessage.value && !props.isFirstInGroup,
  'mb-1': !props.isLastInGroup,
  'mb-3': props.isLastInGroup
}))
</script>

<template>
  <div 
    class="flex items-end"
    :class="[isOwnMessage ? 'justify-end' : 'justify-start', messageClasses]"
  >
    <img 
      v-if="!isOwnMessage && isFirstInGroup"
      :src="message.senderAvatar"
      class="avatar avatar-sm mr-2"
      :alt="message.senderName"
    />
    
    <div 
      class="message-bubble"
      :class="[
        isOwnMessage ? 'message-out' : 'message-in',
        {'rounded-t-2xl': isFirstInGroup},
        {'rounded-b-2xl': isLastInGroup}
      ]"
    >
      {{ message.text }}
      <div class="flex justify-end items-center mt-1 space-x-1">
        <span class="text-xs opacity-70">
          {{ formattedTime }}
        </span>
        <span v-if="isOwnMessage" class="text-xs">
          {{ message.status === 'seen' ? '✓✓' : '✓' }}
        </span>
      </div>
    </div>
  </div>
</template>