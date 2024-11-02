<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useFetch } from '#app';
import { RecipeTypes, type Recipes } from '@prisma/client';

const writtenRecipe = ref('');
const correspondingRecipes = ref<Recipes[]>([]);
const { data, status } = useFetch<Recipes[]>('/api/recipes');

const items = [
  [{
    label: 'Retirer des filtres',
  }], [{
    label: 'Difficulté',
    icon: 'mdi:chef-hat',
    click: () => {
      selectedDifficulty.value = [];
    }
  },{
    label: 'Prix',
    icon: 'arcticons:budgetwatch',
    click: () => {
      selectedBudget.value = [];
    }
  },{
    label: 'Catégorie recette',
    icon: 'ep:dessert',
    click: () => {
      selectedCategory.value = [];
    }
  },], [{
    label: 'Tous les filtres',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      resetFilters();
    },
    shortcuts: ['⌘', 'D']
  }]
]

const searchRecipes = () => {
  if (data.value) {
    correspondingRecipes.value = data.value.filter((r) => {
      const matchesTitle = r.title.toLowerCase().includes(writtenRecipe.value.toLowerCase());

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

const resetFilters = () => {
  selectedCategory.value = [];
  selectedDifficulty.value = [];
  selectedBudget.value = [];
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

watch([writtenRecipe, selectedCategory, selectedDifficulty, selectedBudget], searchRecipes);

const handleKeyDown = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
    event.preventDefault();
    resetFilters();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <UInput color="persian-red" size="lg" type="text" variant="outline" placeholder="Votre recette..." v-model="writtenRecipe" class="w-full" icon="arcticons:recipe-keeper"/>
    <div class="flex space-x-8">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" label="Filtrer" trailing-icon="material-symbols:filter-alt-outline" />
      </UDropdown>
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
        <div v-if="correspondingRecipes.length === 0 && (writtenRecipe || selectedCategory.length || selectedDifficulty.length || selectedBudget.length)">
          <p class="text-lg">Aucune recette ne correspond à votre recherche</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
