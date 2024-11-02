// services/notificationService.js
import { ref, readonly } from 'vue'

const NOTIFICATION_TIMEOUT = 3000

class Notification {
  constructor(id, type, message, timeout = NOTIFICATION_TIMEOUT) {
    this.id = id
    this.type = type
    this.message = message
    this.timeout = timeout
    this.show = true
    this.timer = null
  }
}

const notifications = ref([])
let notificationId = 0

export function useNotifications() {
  function addNotification(type, message, timeout = NOTIFICATION_TIMEOUT) {
    const id = ++notificationId
    const notification = new Notification(id, type, message, timeout)
    
    // Ajouter au début pour l'animation
    notifications.value.unshift(notification)
    
    // Configurer le timer de suppression
    if (timeout > 0) {
      notification.timer = setTimeout(() => {
        removeNotification(id)
      }, timeout)
    }
    
    return id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index === -1) return

    const notification = notifications.value[index]
    
    // Clear le timer si il existe
    if (notification.timer) {
      clearTimeout(notification.timer)
    }
    
    // Déclencher l'animation de sortie
    notification.show = false
    
    // Retirer après l'animation
    setTimeout(() => {
      notifications.value = notifications.value.filter(n => n.id !== id)
    }, 300)
  }

  function clearAllNotifications() {
    notifications.value.forEach(notification => {
      if (notification.timer) {
        clearTimeout(notification.timer)
      }
    })
    notifications.value = []
  }

  return {
    notifications: readonly(notifications),
    notify: (message) => addNotification('info', message),
    success: (message) => addNotification('success', message),
    error: (message) => addNotification('error', message),
    warning: (message) => addNotification('warning', message),
    remove: removeNotification,
    clear: clearAllNotifications
  }
}