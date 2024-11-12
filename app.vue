<script setup lang="ts">
const layout = "custom";
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>
