<script setup>
import { onMounted, ref } from "vue";
import ChatLayout from './layouts/ChatLayout.vue';
import LoadingSpinner from './components/shared/LoadingSpinner.vue';
import { useChatStore } from './stores/chat';
import { useUserStore } from './stores/user';

const isLoading = ref(true);
const chatStore = useChatStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // Simule l'initialisation des stores
    await Promise.all([
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);
    
    // Vérifie que les stores sont initialisés
    if (!chatStore.conversations || !userStore.user) {
      console.error('Stores not initialized properly');
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading app:', error);
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="h-screen bg-dark-primary text-text-primary">
    <!-- État de chargement -->
    <div v-if="isLoading" class="h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
    
    <!-- Contenu principal -->
    <ChatLayout v-else />
  </div>
</template>