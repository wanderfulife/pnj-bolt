<script setup>
import { computed } from 'vue'
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

const isAI = computed(() => props.message.sender === 'ai')
const formattedTime = computed(() => formatMessageTime(props.message.timestamp))

const messageClasses = computed(() => ({
  'ml-12': !isAI.value && !props.isFirstInGroup,
  'mr-12': isAI.value && !props.isFirstInGroup,
  'mb-1': !props.isLastInGroup,
  'mb-3': props.isLastInGroup
}))
</script>

<template>
  <div 
    class="flex items-end"
    :class="[isAI ? 'justify-start' : 'justify-end', messageClasses]"
  >
    <img 
      v-if="isAI && isFirstInGroup"
      :src="message.avatar"
      class="avatar avatar-sm mr-2"
      :alt="message.sender"
    />
    
    <div 
      class="message-bubble"
      :class="[
        isAI ? 'message-in' : 'message-out',
        {'rounded-t-2xl': isFirstInGroup},
        {'rounded-b-2xl': isLastInGroup}
      ]"
    >
      {{ message.text }}
      <div class="flex justify-end items-center mt-1 space-x-1">
        <span class="text-xs opacity-70">
          {{ formattedTime }}
        </span>
        <span v-if="!isAI && message.status" class="text-xs">
          {{ message.status === 'seen' ? '✓✓' : '✓' }}
        </span>
      </div>
    </div>
  </div>
</template>