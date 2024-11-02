<script setup lang="ts">
import { ref, watch } from 'vue';
import { useFetch } from '#app';
import { RecipeTypes, type Recipes } from '@prisma/client';

const recipe = ref('');
const correspondingRecipes = ref<Recipes[]>([]);
const { data, status } = useFetch<Recipes[]>('/api/recipes');

const searchRecipes = () => {
  if (data.value) {
    correspondingRecipes.value = data.value.filter((r) => {
      const matchesTitle = r.title.toLowerCase().includes(recipe.value.toLowerCase());

      const matchesCategory = selectedCategory.value.length
        ? selectedCategory.value.includes(r.type)
        : true;

      const matchesDifficulty = selectedDifficulty.value.length
        ? selectedDifficulty.value.includes(r.difficulty)
        : true;

      const matchesBudget = selectedBudget.value.length
        ? selectedBudget.value.includes(r.budget)
        : true;

      return matchesTitle && matchesCategory && matchesDifficulty && matchesBudget;
    });
  }
};


const category: RecipeTypes[] = [
  "PLAT",
  "DESSERT"
];

const difficulty = ['très facile', 'facile', 'moyenne']; // TODO: Add difficulties if found
const budget = ['bon marché', "moyen", "assez cher"]; // TODO: Add budget if found

const selectedCategory = ref<string[]>([]);
const selectedDifficulty = ref<string[]>([]);
const selectedBudget = ref<string[]>([]);

watch([recipe, selectedCategory, selectedDifficulty, selectedBudget], searchRecipes);
</script>


<template>
  <div class="mt-10 font-lora space-y-4">
    <UInput color="persian-red" size="lg" type="text" variant="outline" placeholder="Votre recette..." v-model="recipe" class="w-full" icon="arcticons:recipe-keeper"/>
    <div class="flex space-x-8">
      <div class="gap-2 focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-sm gap-x-1.5 px-2.5 py-1.5 ring-1 ring-inset ring-current text-norway-500 dark:text-norway-400 hover:bg-norway-50 disabled:bg-transparent aria-disabled:bg-transparent dark:hover:bg-norway-950 dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-norway-500 dark:focus-visible:ring-norway-400 inline-flex items-center">
        <UIcon name="material-symbols:filter-alt-outline" class="w-5 h-5" />
        <p class="text-sm">Filtrer</p>
      </div>
    <div class="flex flex-grow space-x-2 min-w-0">
        <USelectMenu
          v-model="selectedDifficulty"
          :options="difficulty"
          placeholder="Sélectionnez une ou plusieurs difficultés"
          multiple
          option-attribute="name"
          class="flex-grow"
          icon="mdi:chef-hat"
        />
        <USelectMenu
          v-model="selectedBudget"
          :options="budget"
          placeholder="Sélectionnez un ou plusieurs prix"
          multiple
          option-attribute="name"
          class="flex-grow"
          icon="arcticons:budgetwatch"
        />
        <USelectMenu
          v-model="selectedCategory"
          :options="category"
          placeholder="Sélectionnez une ou plusieurs catégories"
          multiple
          option-attribute="name"
          class="flex-grow"
          icon="ep:dessert"
        />
      </div>
</div>
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
                    {{ firstCharacterToUppercase(recipe.difficulty) }}
                  </UButton>
                </UTooltip>
                <UTooltip text="Budget" :popper="{ placement: 'top' }">
                  <UButton color="gray" class="text-norway-500">
                    <UIcon name="arcticons:budgetwatch" class="size-5" />
                    {{ firstCharacterToUppercase(recipe.budget) }}
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
