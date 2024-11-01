<script setup>
import { onMounted, ref } from "vue";
import ChatLayout from './layouts/ChatLayout.vue';

const isLoading = ref(true);

onMounted(() => {
  console.log('App mounted');
  setTimeout(() => {
    isLoading.value = false;
    console.log('Loading finished');
  }, 500);
});
</script>

<template>
  <div class="min-h-screen bg-dark-primary text-text-primary">
    <!-- État de chargement -->
    <div v-if="isLoading" class="h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-primary"></div>
    </div>
    
    <!-- Contenu principal -->
    <ChatLayout v-else />
  </div>
</template>