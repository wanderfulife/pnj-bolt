<script setup>
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '../store/auth'

const emit = defineEmits(['close'])
const authStore = useAuthStore()

const settings = ref({
  notifications: true,
  darkMode: true,
  sound: true,
  language: 'en'
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-40">
    <div class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl z-50">
      <div class="h-full flex flex-col">
        <div class="p-4 bg-dark-bg flex justify-between items-center">
          <h2 class="text-xl font-semibold">Settings</h2>
          <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Notifications -->
          <div class="flex items-center justify-between">
            <span class="text-text-primary">Notifications</span>
            <button 
              class="w-12 h-6 rounded-full relative"
              :class="settings.notifications ? 'bg-primary' : 'bg-dark-hover'"
              @click="settings.notifications = !settings.notifications"
            >
              <span 
                class="absolute w-5 h-5 rounded-full bg-white transition-transform"
                :class="settings.notifications ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Dark Mode -->
          <div class="flex items-center justify-between">
            <span class="text-text-primary">Dark Mode</span>
            <button 
              class="w-12 h-6 rounded-full relative"
              :class="settings.darkMode ? 'bg-primary' : 'bg-dark-hover'"
              @click="settings.darkMode = !settings.darkMode"
            >
              <span 
                class="absolute w-5 h-5 rounded-full bg-white transition-transform"
                :class="settings.darkMode ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Sound -->
          <div class="flex items-center justify-between">
            <span class="text-text-primary">Message Sound</span>
            <button 
              class="w-12 h-6 rounded-full relative"
              :class="settings.sound ? 'bg-primary' : 'bg-dark-hover'"
              @click="settings.sound = !settings.sound"
            >
              <span 
                class="absolute w-5 h-5 rounded-full bg-white transition-transform"
                :class="settings.sound ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Language -->
          <div class="space-y-2">
            <label class="text-text-primary">Language</label>
            <select 
              v-model="settings.language"
              class="w-full bg-dark-hover text-text-primary rounded-lg p-2 border border-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="w-full bg-red-500/10 text-red-500 p-3 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>