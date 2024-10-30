<script setup>
defineProps({
  size: {
    type: String,
    default: 'md'
  }
})
</script>

<template>
  <div class="flex justify-center items-center">
    <div 
      class="animate-spin rounded-full border-t-2 border-primary"
      :class="{
        'w-4 h-4': size === 'sm',
        'w-8 h-8': size === 'md',
        'w-12 h-12': size === 'lg'
      }"
    ></div>
  </div>
</template>