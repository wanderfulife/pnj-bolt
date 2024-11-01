<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  }
})
</script>

<template>
  <div class="flex justify-center items-center">
    <div 
      class="animate-spin rounded-full border-2"
      :class="{
        'w-4 h-4': size === 'sm',
        'w-8 h-8': size === 'md',
        'w-12 h-12': size === 'lg',
        'border-accent-primary border-t-transparent': color === 'primary',
        'border-text-primary border-t-transparent': color === 'white'
      }"
    ></div>
  </div>
</template>