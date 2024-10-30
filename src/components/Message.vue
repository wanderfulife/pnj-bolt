<script setup>
import { format } from 'date-fns'

defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div 
    class="mb-4 flex"
    :class="message.type === 'sent' ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[70%] rounded-lg px-4 py-2"
      :class="message.type === 'sent' ? 'bg-message-out' : 'bg-dark-secondary'"
    >
      <div class="flex items-end space-x-2">
        <p class="text-text-primary">{{ message.text }}</p>
        <span class="text-xs text-text-secondary min-w-[55px] self-end">
          {{ format(message.timestamp, 'HH:mm') }}
        </span>
      </div>
    </div>
  </div>
</template>