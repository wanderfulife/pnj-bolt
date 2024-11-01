<script setup>
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const emit = defineEmits(['close'])

const stats = [
  { label: 'Conversations', value: '24' },
  { label: 'AI Friends', value: '12' },
  { label: 'Active Days', value: '45' }
]
</script>

<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl z-50 animate-slide-in">
    <!-- En-tête -->
    <div class="p-4 bg-dark-primary flex justify-between items-center border-b border-border-color">
      <h2 class="text-xl font-semibold">Your Profile</h2>
      <button 
        @click="$emit('close')" 
        class="text-text-secondary hover:text-text-primary"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Contenu du profil -->
    <div class="overflow-y-auto h-[calc(100%-4rem)] p-6 space-y-6">
      <!-- Avatar et nom -->
      <div class="text-center relative">
        <div class="relative inline-block">
          <img 
            :src="userStore.user.avatar" 
            class="w-24 h-24 rounded-full mx-auto"
            alt="Your profile"
          />
          <button 
            class="absolute bottom-0 right-0 p-2 bg-accent-primary rounded-full shadow-lg hover:bg-accent-secondary transition-colors"
          >
            <PencilIcon class="w-4 h-4 text-white" />
          </button>
        </div>
        <h3 class="mt-4 text-xl font-semibold">{{ userStore.user.name }}</h3>
        <p class="text-text-secondary">{{ userStore.user.profile.email }}</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-3 gap-4">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="bg-dark-hover rounded-lg p-3 text-center"
        >
          <p class="text-xl font-bold text-accent-primary">{{ stat.value }}</p>
          <p class="text-sm text-text-secondary">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Informations personnelles -->
      <div class="space-y-4">
        <h4 class="font-semibold text-text-primary">Personal Information</h4>
        <div class="space-y-3">
          <div class="flex items-center text-text-secondary">
            <span class="material-icons mr-2">location_on</span>
            {{ userStore.user.profile.location }}
          </div>
          <div class="flex items-center text-text-secondary">
            <span class="material-icons mr-2">calendar_today</span>
            Joined {{ userStore.user.profile.joined }}
          </div>
        </div>
      </div>

      <!-- Intérêts -->
      <div>
        <h4 class="font-semibold text-text-primary mb-3">Interests</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="interest in userStore.user.profile.interests" 
            :key="interest"
            class="px-3 py-1 bg-dark-hover rounded-full text-sm text-text-secondary"
          >
            {{ interest }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4">
        <button class="w-full bg-dark-hover text-text-primary p-3 rounded-lg hover:bg-dark-active transition-colors">
          Edit Profile
        </button>
        <button class="w-full mt-3 bg-red-500/10 text-red-500 p-3 rounded-lg hover:bg-red-500/20 transition-colors">
          Logout
        </button>
      </div>
    </div>
  </div>

  <!-- Overlay de fond -->
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="$emit('close')"
  ></div>
</template>