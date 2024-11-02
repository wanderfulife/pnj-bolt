// components/profile/UserProfile.vue
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/services/notificationService'
import { 
  XMarkIcon, 
  PencilIcon,
  CameraIcon,
  CheckIcon
} from '@heroicons/vue/24/solid'
import LoadingSpinner from '../shared/LoadingSpinner.vue'
import Avatar from '../shared/Avatar.vue'

const authStore = useAuthStore()
const notifications = useNotifications()

// État local
const isEditing = ref(false)
const isLoading = ref(false)
const isSaving = ref(false)
const activeTab = ref('profile') // ['profile', 'preferences', 'privacy']

// Form data
const editedProfile = ref({
  name: authStore.user?.name || '',
  bio: authStore.user?.profile?.bio || '',
  location: authStore.user?.profile?.location || '',
  interests: [...(authStore.user?.profile?.interests || [])],
  newInterest: ''
})

// Computed
const hasChanges = computed(() => {
  return (
    editedProfile.value.name !== authStore.user?.name ||
    editedProfile.value.bio !== authStore.user?.profile?.bio ||
    editedProfile.value.location !== authStore.user?.profile?.location ||
    !arraysEqual(editedProfile.value.interests, authStore.user?.profile?.interests || [])
  )
})

const canSave = computed(() => {
  return hasChanges.value && editedProfile.value.name.trim().length > 0
})

// Methods
function arraysEqual(a, b) {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

function addInterest(event) {
  const interest = editedProfile.value.newInterest.trim()
  if (
    interest && 
    !editedProfile.value.interests.includes(interest) &&
    editedProfile.value.interests.length < 5
  ) {
    editedProfile.value.interests.push(interest)
    editedProfile.value.newInterest = ''
  }
}

function removeInterest(index) {
  editedProfile.value.interests.splice(index, 1)
}

async function handleUpdateProfile() {
  if (!canSave.value) return

  try {
    isSaving.value = true

    await authStore.updateProfile({
      name: editedProfile.value.name,
      profile: {
        bio: editedProfile.value.bio,
        location: editedProfile.value.location,
        interests: editedProfile.value.interests,
      }
    })

    notifications.success('Profile updated successfully')
    isEditing.value = false
  } catch (error) {
    notifications.error(error.message)
  } finally {
    isSaving.value = false
  }
}

async function handleLogout() {
  try {
    isLoading.value = true
    await authStore.logout()
    notifications.success('Logged out successfully')
  } catch (error) {
    notifications.error(error.message)
  } finally {
    isLoading.value = false
  }
}

defineEmits(['close'])
</script>

<template>
  <div class="fixed inset-y-0 right-0 w-full sm:w-96 bg-dark-secondary shadow-xl z-50">
    <!-- Header -->
    <header class="p-4 bg-dark-primary flex justify-between items-center border-b border-border-color">
      <div class="flex items-center space-x-2">
        <h2 class="text-xl font-semibold">Your Profile</h2>
        <span 
          v-if="isEditing"
          class="text-xs bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-full"
        >
          Editing
        </span>
      </div>
      <button 
        @click="$emit('close')"
        class="btn btn-secondary p-2"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </header>

    <!-- Profile Navigation -->
    <nav class="px-4 border-b border-border-color">
      <div class="flex space-x-4">
        <button
          v-for="tab in ['profile', 'preferences', 'privacy']"
          :key="tab"
          @click="activeTab = tab"
          class="py-3 px-2 relative"
          :class="activeTab === tab ? 'text-text-primary' : 'text-text-secondary'"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <div 
            v-if="activeTab === tab"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-t-full"
          />
        </button>
      </div>
    </nav>

    <!-- Content -->
    <div class="overflow-y-auto h-[calc(100%-8rem)] p-6 space-y-6">
      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <!-- Avatar Section -->
        <div class="text-center relative">
          <div class="relative inline-block">
            <Avatar
              :src="authStore.user.avatar"
              :alt="authStore.user.name"
              size="lg"
              class="ring-4 ring-accent-primary/20"
            />
            <button 
              v-if="isEditing"
              class="absolute bottom-0 right-0 p-2 bg-accent-primary rounded-full shadow-lg hover:bg-accent-secondary transition-colors"
            >
              <CameraIcon class="w-5 h-5 text-white" />
            </button>
          </div>
          
          <!-- Name -->
          <div class="mt-4">
            <div v-if="isEditing" class="space-y-1">
              <input
                v-model="editedProfile.name"
                type="text"
                class="input-field text-center text-xl font-semibold"
                placeholder="Your name"
              />
              <p class="text-xs text-text-secondary">
                This is how you'll appear to others
              </p>
            </div>
            <h3 v-else class="text-xl font-semibold">
              {{ authStore.user.name }}
            </h3>
          </div>
          <p class="text-text-secondary mt-1">{{ authStore.user.email }}</p>
        </div>

        <!-- Bio Section -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-text-primary">About</h4>
            <span class="text-xs text-text-secondary">
              {{ editedProfile.bio.length }}/200
            </span>
          </div>
          <textarea
            v-if="isEditing"
            v-model="editedProfile.bio"
            class="input-field min-h-[100px] w-full resize-none"
            placeholder="Tell others about yourself..."
            maxlength="200"
          />
          <p v-else class="text-text-secondary">
            {{ authStore.user.profile?.bio || 'No bio yet' }}
          </p>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <h4 class="font-semibold text-text-primary">Location</h4>
          <input
            v-if="isEditing"
            v-model="editedProfile.location"
            type="text"
            class="input-field w-full"
            placeholder="Where are you based?"
          />
          <p v-else class="text-text-secondary">
            {{ authStore.user.profile?.location || 'No location set' }}
          </p>
        </div>

        <!-- Interests -->
        <div class="space-y-2">
          <h4 class="font-semibold text-text-primary">
            Interests 
            <span class="text-xs text-text-secondary">
              ({{ editedProfile.interests.length }}/5)
            </span>
          </h4>
          <div v-if="isEditing" class="space-y-2">
            <div class="flex space-x-2">
              <input
                v-model="editedProfile.newInterest"
                type="text"
                class="input-field flex-1"
                placeholder="Add an interest"
                @keyup.enter="addInterest"
                :disabled="editedProfile.interests.length >= 5"
              />
              <button 
                class="btn btn-secondary"
                @click="addInterest"
                :disabled="!editedProfile.newInterest.trim() || editedProfile.interests.length >= 5"
              >
                Add
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="(interest, index) in editedProfile.interests"
                :key="index"
                class="px-3 py-1 bg-dark-hover rounded-full text-sm flex items-center space-x-1"
              >
                <span>{{ interest }}</span>
                <button
                  @click="removeInterest(index)"
                  class="hover:text-red-500"
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
      </div>

      <!-- Actions -->
      <div class="pt-4 border-t border-border-color">
        <div v-if="isEditing" class="space-y-3">
          <button
            @click="handleUpdateProfile"
            class="btn btn-primary w-full flex items-center justify-center space-x-2"
            :disabled="!canSave || isSaving"
          >
            <LoadingSpinner v-if="isSaving" size="sm" color="white" />
            <span v-else>Save Changes</span>
          </button>
          
          <button
            @click="isEditing = false"
            class="btn btn-secondary w-full"
            :disabled="isSaving"
          >
            Cancel
          </button>
        </div>
        
        <div v-else class="space-y-3">
          <button
            @click="isEditing = true"
            class="btn btn-secondary w-full"
          >
            Edit Profile
          </button>

          <button
            @click="handleLogout"
            class="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 w-full"
            :disabled="isLoading"
          >
            <LoadingSpinner v-if="isLoading" size="sm" color="red" />
            <span v-else>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black/50 z-40"
    @click="$emit('close')"
  />
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .profile-drawer {
    width: 100%;
  }
}
</style>