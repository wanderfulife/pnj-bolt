<script setup>
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: 'User avatar'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  status: {
    type: String,
    default: '',
    validator: (value) => ['', 'online', 'offline', 'away'].includes(value)
  }
})

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  away: 'bg-yellow-500'
}
</script>

<template>
  <div class="relative inline-block">
    <img
      :src="src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`"
      :alt="alt"
      :class="[
        'rounded-full object-cover',
        sizeClasses[size]
      ]"
    />
    
    <div
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full border-2 border-dark-primary',
        statusColors[status],
        size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'
      ]"
    ></div>
  </div>
</template>