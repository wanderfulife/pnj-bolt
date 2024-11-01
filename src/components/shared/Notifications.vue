<script setup>
import { useNotifications } from '../../services/notificationService'
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid'

const { notifications, remove } = useNotifications()

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon,
  info: InformationCircleIcon
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center p-4 rounded-lg shadow-lg text-white max-w-sm"
        :class="[colors[notification.type]]"
        v-show="notification.show"
      >
        <component
          :is="icons[notification.type]"
          class="w-5 h-5 mr-3 flex-shrink-0"
        />
        <p class="flex-1">{{ notification.message }}</p>
        <button
          @click="remove(notification.id)"
          class="ml-3 flex-shrink-0 hover:opacity-75"
        >
          <XCircleIcon class="w-5 h-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>