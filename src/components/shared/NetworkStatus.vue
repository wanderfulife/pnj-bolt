<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotifications } from '../../services/notificationService'

const isOnline = ref(navigator.onLine)
const notifications = useNotifications()

function updateOnlineStatus() {
  const wasOnline = isOnline.value
  isOnline.value = navigator.onLine
  
  if (!wasOnline && isOnline.value) {
    notifications.success('Connection restored')
  } else if (wasOnline && !isOnline.value) {
    notifications.error('No internet connection')
  }
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
  <div
    v-if="!isOnline"
    class="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50"
  >
    No internet connection. Please check your network.
  </div>
</template>