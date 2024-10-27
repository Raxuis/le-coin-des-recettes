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
        Veuillez patienter...
      </p>
      <div v-else-if="status === 'error'">
      <p class="text-lg">Erreur</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="recipe in data?.slice(0, 30)" :key="recipe.title">
          <template #header>
            <div class="flex flex-col space-y-2 items-center justify-center">
              <p class="text-lg">{{ recipe.title }}</p>
            </div>
          </template>
            <NuxtLink class="underline underline-offset-2 inline-flex gap-1 group" :to="`/recipe/${slugTitle(recipe.title)}`">
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
                  <UIcon name="arcticons:budgetwatch" class="w-5 h-5" />
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
