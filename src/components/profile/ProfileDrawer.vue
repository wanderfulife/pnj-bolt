<script setup>
import { XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  profile: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// Traits de personnalité avec pourcentages
const personalityTraits = [
  { label: props.profile?.traits?.[0] || 'Creative', value: 85 },
  { label: props.profile?.traits?.[1] || 'Empathetic', value: 92 },
  { label: props.profile?.traits?.[2] || 'Curious', value: 78 },
  { label: props.profile?.traits?.[3] || 'Supportive', value: 88 }
]
</script>

<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl z-50 animate-slide-in">
    <!-- En-tête -->
    <div class="p-4 bg-dark-primary flex justify-between items-center border-b border-border-color">
      <h2 class="text-xl font-semibold">Profile</h2>
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
      <div class="text-center">
        <img 
          :src="profile.avatar" 
          class="w-24 h-24 rounded-full mx-auto"
          :alt="profile.name"
        />
        <h3 class="mt-4 text-xl font-semibold">{{ profile.name }}</h3>
        <p class="text-text-secondary">AI Companion</p>
      </div>

      <!-- Bio -->
      <div class="space-y-2">
        <h4 class="font-semibold text-text-primary">About</h4>
        <p class="text-text-secondary">{{ profile.profile?.bio }}</p>
      </div>

      <!-- Informations -->
      <div class="space-y-3">
        <div class="flex items-center text-text-secondary">
          <span class="material-icons mr-2">location_on</span>
          {{ profile.profile?.location }}
        </div>
        <div class="flex items-center text-text-secondary">
          <span class="material-icons mr-2">calendar_today</span>
          Created {{ profile.profile?.createdAt }}
        </div>
      </div>

      <!-- Traits de personnalité -->
      <div class="space-y-4">
        <h4 class="font-semibold text-text-primary">Personality Traits</h4>
        <div class="space-y-3">
          <div v-for="trait in personalityTraits" :key="trait.label" class="space-y-1">
            <div class="flex justify-between text-sm">
              <span>{{ trait.label }}</span>
              <span class="text-text-secondary">{{ trait.value }}%</span>
            </div>
            <div class="h-2 bg-dark-hover rounded-full overflow-hidden">
              <div 
                class="h-full bg-accent-primary rounded-full transition-all duration-300"
                :style="{ width: `${trait.value}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Intérêts -->
      <div>
        <h4 class="font-semibold text-text-primary mb-3">Interests</h4>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="interest in profile.profile?.interests" 
            :key="interest"
            class="px-3 py-1 bg-dark-hover rounded-full text-sm text-text-secondary"
          >
            {{ interest }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay de fond -->
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="$emit('close')"
  ></div>
</template>