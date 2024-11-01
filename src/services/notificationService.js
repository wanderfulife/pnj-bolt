// src/services/notificationService.js
import { ref } from 'vue'

const notifications = ref([])

export const useNotifications = () => {
  function addNotification({ type = 'info', message, duration = 3000 }) {
    const id = Date.now()
    
    const notification = {
      id,
      type,
      message,
      show: true
    }
    
    notifications.value.push(notification)
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }
  
  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value[index].show = false
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
      }, 300)
    }
  }
  
  return {
    notifications,
    notify: (message) => addNotification({ message }),
    success: (message) => addNotification({ type: 'success', message }),
    error: (message) => addNotification({ type: 'error', message }),
    warning: (message) => addNotification({ type: 'warning', message }),
    remove: removeNotification
  }
}