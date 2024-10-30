<script setup>
import { onMounted, ref } from "vue";

const isLoading = ref(true);

onMounted(() => {
  // Simple initial loading simulation
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<template>
  <div class="min-h-screen bg-dark-bg">
    <!-- Loading State -->
    <div v-if="isLoading" class="h-screen flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"
      ></div>
    </div>
    <!-- Main Content -->
    <router-view v-else></router-view>
  </div>
</template>