<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="bg-red-500/10 text-red-500 p-4 rounded-lg">
    {{ message }}
  </div>
</template>