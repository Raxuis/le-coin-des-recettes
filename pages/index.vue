<script setup lang="ts">
const recipe = ref('')
import { useFetch } from '#app';
import type { Recipes } from '@prisma/client';
const { data, status } = useFetch<Recipes[]>('/api/recipes');
</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <div>
      <p>Bienvenue sur <span class="font-semibold">Le Coin des Recettes !</span></p>
      <p>Maintenant, cherchez une recette qui vous plairait.</p>
    </div>
  </div>
</template>
