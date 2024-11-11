<script setup lang="ts">
import { type Recipes } from '@prisma/client';
import { useFetch } from 'nuxt/app';
import { useRoute, useRouter } from 'vue-router';
import { previousRoute } from '../../../../utils/previousRoute';

const route = useRoute();
const router = useRouter();
const recipeSlug = route.params.slug;
const { data, status } = useFetch<Recipes>('/api/recipe', {
  method: 'POST',
  body: {
    slug: recipeSlug
  },
});

function goBack() {
  if (previousRoute.value) {
    router.push(previousRoute.value);
  } else {
    router.push('/');
  }
}
</script>

<template>
  <div>
    <p v-if="status === 'pending'">
      Veuillez patienter...
    </p>
    <div v-else-if="status === 'error'">
      <p class="text-lg">Erreur</p>
    </div>
    <div v-else class="flex flex-col space-y-4 font-lora">
      <div class="flex gap-4 items-center">
        <UButton
          icon="material-symbols:arrow-back"
          size="sm"
          color="white"
          square
          variant="solid"
          @click="goBack"
          />
        <p class="text-xl">{{ data?.title }}</p>
      </div>
      <p class="text-sm" v-if="data?.people && data?.people !== 0">Recette pour <span class="font-extrabold">{{ data?.people }} personnes</span>.</p>
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
