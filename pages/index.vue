<script setup lang="ts">
const recipe = ref('')
import { useFetch } from '#app';
import type { Recipes } from '@prisma/client';
const { data, status } = useFetch<Recipes[]>('/api/recipes');
if (data.value) console.log(data.value);
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
    <div>
      <p v-if="status === 'pending'">
        Loading...
      </p>
      <div v-else-if="status === 'error'">
      <p class="text-lg">Error</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <UCard v-for="recipe in data?.slice(0, 30)" :key="recipe.title">
  <template #header>
    <div class="flex flex-col space-y-2 items-center justify-center">
      <p class="text-xl">{{ recipe.title }}</p>
    </div>
  </template>
</UCard>
      </div>
    </div>
    </div>
  </div>
</template>
