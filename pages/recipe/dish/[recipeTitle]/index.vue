<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const recipeTitle = route.params.recipeTitle;
</script>

<template>
  <div>
    <h1>Recipe: {{ recipeTitle }}</h1>
  </div>
</template>
