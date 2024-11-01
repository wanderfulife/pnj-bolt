<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'

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

const messageClasses = computed(() => {
  return {
    'ml-12': !isAI.value && !props.isFirstInGroup,
    'mr-12': isAI.value && !props.isFirstInGroup,
    'mb-1': !props.isLastInGroup,
    'mb-3': props.isLastInGroup
  }
})

const bubbleClasses = computed(() => {
  return {
    'bg-message-out text-white': !isAI.value,
    'bg-message-in': isAI.value,
    'rounded-t-2xl': props.isFirstInGroup,
    'rounded-b-2xl': props.isLastInGroup,
    'rounded-l-2xl': !isAI.value,
    'rounded-r-2xl': isAI.value
  }
})
</script>

<template>
  <div 
    class="flex items-end"
    :class="[isAI ? 'justify-start' : 'justify-end', messageClasses]"
  >
    <!-- Avatar (uniquement pour le premier message du groupe) -->
    <img 
      v-if="isAI && isFirstInGroup"
      :src="message.avatar"
      class="w-8 h-8 rounded-full mr-2"
      :alt="message.sender"
    />

    <!-- Bulle de message -->
    <div 
      class="px-4 py-2 max-w-[70%] break-words"
      :class="bubbleClasses"
    >
      {{ message.text }}
      <div class="flex justify-end items-center mt-1 space-x-1">
        <span class="text-xs opacity-70">
          {{ format(new Date(message.timestamp), 'HH:mm') }}
        </span>
        <span v-if="!isAI && message.status" class="text-xs">
          {{ message.status === 'seen' ? '✓✓' : '✓' }}
        </span>
      </div>
    </div>
  </div>
</template>