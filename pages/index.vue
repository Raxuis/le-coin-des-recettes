<script setup lang="ts">
const {data} = useAuth()
</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <div>
      <p>Bienvenue {{ data?.user?.name }} sur <span class="font-semibold">Le Coin des Recettes !</span></p>
      <p>Maintenant, cherchez une recette qui vous plairait.</p>
    </div>
  </div>
</template>
