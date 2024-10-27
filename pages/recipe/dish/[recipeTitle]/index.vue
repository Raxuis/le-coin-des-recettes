<script setup lang="ts">
import { type Recipes } from '@prisma/client';
import { useFetch } from 'nuxt/app';
import { useRoute } from 'vue-router';

const route = useRoute();
const recipeSlug = route.params.recipeTitle;
const { data, status } = useFetch<Recipes[]>('/api/recipe', {
  method: 'POST',
  body: {
    slug: recipeSlug
  },
});

console.log(data)
</script>

<template>
  <div>
    <h1>Recipe: {{ recipeSlug }}</h1>
  </div>
</template>
