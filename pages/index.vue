<script setup lang="ts">
const recipe = ref('')
</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <div>
      <p>Bienvenue sur <span class="font-semibold">Le Coin des Recettes !</span></p>
      <p>Maintenant, cherchez une recette qui vous plairait.</p>
    </div>
    <div class="flex gap-2">
      <UInput color="persian-red" size="lg" type="text" variant="outline" placeholder="Votre recette..." v-model="recipe" class="flex-grow"  />
      <UButton
        icon="fluent:receipt-search-20-regular"
        size="lg"
        color="persian-red"
        square
        variant="solid"
        />
    </div>
  </div>
</template>
