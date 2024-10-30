<script setup lang="ts">
import { type Recipes } from '@prisma/client';
import { useFetch } from 'nuxt/app';
import { useRoute } from 'vue-router';

const route = useRoute();
const recipeSlug = route.params.slug;
const { data, status } = useFetch<Recipes>('/api/recipe', {
  method: 'POST',
  body: {
    slug: recipeSlug
  },
});
</script>

<template>
  <div>
    <p v-if="status === 'pending'">
      Veuillez patienter...
    </p>
    <div v-else-if="status === 'error'">
      <p class="text-lg">Erreur</p>
    </div>
    <div v-else class="flex flex-col space-y-2 font-lora">
      <p class="text-xl">{{ data?.title }}</p>
      <p class="text-lg">Étapes :</p>
      <ol class="list-decimal list-inside space-y-1">
        <li v-for="step in data?.steps" :key="step">
          {{ step }}
        </li>
      </ol>

      <hr />

      <p class="text-lg">Ingrédients :</p>
      <ul class="list-disc list-inside space-y-1">
        <li v-for="ingredient in data?.ingredients" :key="ingredient">
          {{ firstCharacterToUppercase(ingredient) }}
        </li>
      </ul>
    </div>
  </div>
</template>
