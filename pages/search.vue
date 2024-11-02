<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFetch } from '#app';
import type { Recipes } from '@prisma/client';

const recipe = ref('');
const correspondingRecipes = ref<Recipes[]>([]);
const { data, status } = useFetch<Recipes[]>('/api/recipes');

const searchRecipes = () => {
  if (data.value) {
    correspondingRecipes.value = data.value.filter((r) =>
      r.title.toLowerCase().includes(recipe.value.toLowerCase())
    );
  }
};

watch(recipe, searchRecipes);
</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <UInput color="persian-red" size="lg" type="text" variant="outline" placeholder="Votre recette..." v-model="recipe" class="w-full" icon="arcticons:recipe-keeper"/>
    <div>
      <p v-if="status === 'pending'">Veuillez patienter...</p>
      <div v-else-if="status === 'error'">
        <p class="text-lg">Erreur</p>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="recipe in (correspondingRecipes.length ? correspondingRecipes : (data ?? [])).slice(0, 30)" :key="recipe.id">
            <template #header>
              <div class="flex flex-col items-center justify-center">
                <p class="text-lg">{{ recipe.title }}</p>
                <p class="text-sm text-gray-500">{{ firstCharacterToUppercase(recipe.type.toLowerCase()) }}</p>
              </div>
            </template>
            <NuxtLink class="underline underline-offset-2 inline-flex gap-1 group" :to="`/recipe/dish/${recipe.slug}`">
              <p>En savoir plus</p>
              <UIcon name="lucide:arrow-up-right" class="size-5 mt-1 group-hover:translate-x-1 duration-300" />
            </NuxtLink>
            <template #footer>
              <div class="flex justify-between px-2">
                <UTooltip text="Difficulté" :popper="{ placement: 'top' }">
                  <UButton color="gray" class="text-serenade-500">
                    <UIcon name="mdi:chef-hat" class="size-5" />
                    {{ firstCharacterToUppercase(recipe.budget) }}
                  </UButton>
                </UTooltip>
                <UTooltip text="Budget" :popper="{ placement: 'top' }">
                  <UButton color="gray" class="text-norway-500">
                    <UIcon name="arcticons:budgetwatch" class="size-5" />
                    {{ firstCharacterToUppercase(recipe.difficulty) }}
                  </UButton>
                </UTooltip>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
