<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { dbUtils } from '../../firebase/utils'
import { XMarkIcon, PencilIcon } from '@heroicons/vue/24/solid'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const authStore = useAuthStore()
const isEditing = ref(false)
const isLoading = ref(false)
const error = ref(null)

const editedProfile = ref({
  name: authStore.user?.name || '',
  bio: authStore.user?.profile?.bio || '',
  location: authStore.user?.profile?.location || '',
  interests: [...(authStore.user?.profile?.interests || [])]
})

async function handleUpdateProfile() {
  try {
    isLoading.value = true
    error.value = null

    await dbUtils.updateUserProfile(authStore.user.uid, {
      name: editedProfile.value.name,
      profile: {
        ...authStore.user.profile,
        bio: editedProfile.value.bio,
        location: editedProfile.value.location,
        interests: editedProfile.value.interests
      }
    })

    isEditing.value = false
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
}

const emit = defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl z-50 animate-slide-in">
    <!-- Header -->
    <div class="p-4 bg-dark-primary flex justify-between items-center border-b border-border-color">
      <h2 class="text-xl font-semibold">Your Profile</h2>
      <button 
        @click="$emit('close')" 
        class="text-text-secondary hover:text-text-primary"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>

    <!-- Content -->
    <div class="overflow-y-auto h-[calc(100%-4rem)] p-6 space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>

      <template v-else>
        <!-- Avatar and Name -->
        <div class="text-center relative">
          <div class="relative inline-block">
            <img 
              :src="authStore.user.avatar" 
              class="w-24 h-24 rounded-full mx-auto"
              alt="Your profile"
            />
            <button 
              v-if="isEditing"
              class="absolute bottom-0 right-0 p-2 bg-accent-primary rounded-full shadow-lg hover:bg-accent-secondary transition-colors"
            >
              <PencilIcon class="w-4 h-4 text-white" />
            </button>
          </div>
          
          <div class="mt-4">
            <input
              v-if="isEditing"
              v-model="editedProfile.name"
              type="text"
              class="input-field text-center text-xl font-semibold"
            />
            <h3 v-else class="text-xl font-semibold">{{ authStore.user.name }}</h3>
          </div>
          <p class="text-text-secondary">{{ authStore.user.email }}</p>
        </div>

        <!-- Profile Information -->
        <div class="space-y-4">
          <h4 class="font-semibold text-text-primary">About</h4>
          <textarea
            v-if="isEditing"
            v-model="editedProfile.bio"
            class="input-field min-h-[100px] w-full"
            placeholder="Tell us about yourself..."
          ></textarea>
          <p v-else class="text-text-secondary">{{ authStore.user.profile?.bio || 'No bio yet' }}</p>
        </div>

        <!-- Location -->
        <div class="space-y-4">
          <h4 class="font-semibold text-text-primary">Location</h4>
          <input
            v-if="isEditing"
            v-model="editedProfile.location"
            type="text"
            class="input-field w-full"
            placeholder="Your location"
          />
          <p v-else class="text-text-secondary">{{ authStore.user.profile?.location || 'No location set' }}</p>
        </div>

        <!-- Interests -->
        <div class="space-y-4">
          <h4 class="font-semibold text-text-primary">Interests</h4>
          <div v-if="isEditing" class="space-y-2">
            <input
              v-model="newInterest"
              type="text"
              class="input-field w-full"
              placeholder="Add an interest"
              @keyup.enter="addInterest"
            />
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(interest, index) in editedProfile.interests"
                :key="index"
                class="px-3 py-1 bg-dark-hover rounded-full text-sm text-text-secondary flex items-center"
              >
                {{ interest }}
                <button
                  @click="editedProfile.interests.splice(index, 1)"
                  class="ml-2 text-text-tertiary hover:text-text-primary"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <span
              v-for="interest in authStore.user.profile?.interests"
              :key="interest"
              class="px-3 py-1 bg-dark-hover rounded-full text-sm text-text-secondary"
            >
              {{ interest }}
            </span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Actions -->
        <div class="pt-4 space-y-3">
          <button
            v-if="isEditing"
            @click="handleUpdateProfile"
            class="w-full btn btn-primary"
            :disabled="isLoading"
          >
            Save Changes
          </button>
          
          <button
            v-else
            @click="isEditing = true"
            class="w-full btn btn-secondary"
          >
            Edit Profile
          </button>

          <button
            @click="handleLogout"
            class="w-full btn bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </template>
    </div>
  </div>

  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="$emit('close')"
  ></div>
</template>