<script setup>
import { ref } from 'vue'
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  show: Boolean,
  chat: Object
})

defineEmits(['close'])

const personalityTraits = [
  { label: 'Friendly', value: 85 },
  { label: 'Creative', value: 92 },
  { label: 'Analytical', value: 78 },
  { label: 'Empathetic', value: 88 }
]
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl transform transition-transform duration-300 z-30"
    :class="show ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="p-4 bg-dark-bg flex justify-between items-center">
        <h2 class="text-xl font-semibold">Profile Info</h2>
        <button @click="$emit('close')" class="text-text-secondary hover:text-text-primary">
          <XMarkIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Profile Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Avatar Section -->
        <div class="text-center">
          <div class="relative inline-block">
            <img :src="chat.avatar" class="w-32 h-32 rounded-full mx-auto" />
            <button 
              class="absolute bottom-0 right-0 bg-primary p-2 rounded-full shadow-lg hover:bg-secondary transition-colors"
            >
              <PencilIcon class="w-4 h-4 text-white" />
            </button>
          </div>
          <h3 class="mt-4 text-xl font-semibold">{{ chat.name }}</h3>
          <p class="text-text-secondary">NPC Character</p>
        </div>

        <!-- Personality Traits -->
        <div class="space-y-4">
          <h4 class="text-lg font-semibold border-b border-dark-hover pb-2">Personality Traits</h4>
          <div class="space-y-3">
            <div v-for="trait in personalityTraits" :key="trait.label" class="space-y-1">
              <div class="flex justify-between text-sm">
                <span>{{ trait.label }}</span>
                <span class="text-text-secondary">{{ trait.value }}%</span>
              </div>
              <div class="h-2 bg-dark-hover rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-300"
                  :style="{ width: `${trait.value}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-dark-hover rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-primary">2,451</p>
            <p class="text-text-secondary text-sm">Messages</p>
          </div>
          <div class="bg-dark-hover rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-primary">89%</p>
            <p class="text-text-secondary text-sm">Response Rate</p>
          </div>
        </div>

        <!-- Interests -->
        <div>
          <h4 class="text-lg font-semibold border-b border-dark-hover pb-2 mb-3">Interests</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="interest in ['AI', 'Technology', 'Art', 'Music', 'Science']" 
              :key="interest"
              class="px-3 py-1 bg-dark-hover rounded-full text-sm text-text-secondary"
            >
              {{ interest }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Backdrop for mobile -->
  <div 
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
    @click="$emit('close')"
  ></div>
</template>