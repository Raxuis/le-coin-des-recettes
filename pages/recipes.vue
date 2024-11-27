<script setup lang="ts">
import {ref, computed, watch, onMounted, onBeforeUnmount} from 'vue';
import {useFetch} from '#app';
import {type Recipes} from '@prisma/client';
import {
  difficulty,
  budget,
  category
} from '@/constants';
import {onBeforeRouteLeave} from 'vue-router';
import {firstCharacterToUppercase} from '@/utils/textFormatting';


const writtenRecipe = ref('');
const correspondingRecipes = ref<Recipes[]>([]);

const {data, status} = useFetch<Recipes[]>('/api/recipes');

const currentPage = ref(1);
const recipesPerPage = 30;

const totalPages = computed(() => {
  return Math.ceil((correspondingRecipes.value.length) / recipesPerPage);
});

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * recipesPerPage;
  const end = start + recipesPerPage;
  return correspondingRecipes.value.slice(start, end);
});

watchEffect(() => {
  if (status.value === 'success' && data.value) {
    correspondingRecipes.value = data.value;
  }
});

watchEffect(() => {
  console.log('Corresponding Recipes:', correspondingRecipes.value);
  console.log('Paginated Recipes:', paginatedRecipes.value);
});



const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const items = [
  [{
    label: 'Retirer des filtres',
  }], [{
    label: 'Difficulté',
    icon: 'mdi:chef-hat',
    click: () => {
      selectedDifficulty.value = [];
    }
  }, {
    label: 'Prix',
    icon: 'material-symbols:money-bag-rounded',
    click: () => {
      selectedBudget.value = [];
    }
  }, {
    label: 'Catégorie recette',
    icon: 'bx:bxs-dish',
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

    // Resetting pagination
    currentPage.value = 1;
  }
};



const resetFilters = () => {
  selectedCategory.value = [];
  selectedDifficulty.value = [];
  selectedBudget.value = [];
};

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

onBeforeRouteLeave((to, from, next) => {
  previousRoute.value = from.fullPath;
  next();
});

</script>

<template>
  <div class="mt-10 font-lora space-y-4">
    <UInput color="persian-red" size="lg" type="text" variant="outline" placeholder="Votre recette..."
            v-model="writtenRecipe" class="w-full" icon="arcticons:recipe-keeper"/>
    <div class="flex max-sm:space-y-2 space-x-0 sm:space-x-8 max-sm:flex-col">
      <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
        <UButton color="white" label="Filtrer" trailing-icon="material-symbols:filter-alt-outline"
                 class="font-extrabold"/>
      </UDropdown>
      <div class="flex flex-grow space-x-0 sm:space-x-2 min-w-0 max-sm:space-y-1 max-sm:flex-col">
        <USelectMenu
            v-model="selectedDifficulty"
            :options="Array.from(difficulty)"
            placeholder="Sélectionnez une ou plusieurs difficultés"
            multiple
            option-attribute="name"
            class="flex-grow"
            icon="mdi:chef-hat"
        />
        <USelectMenu
            v-model="selectedBudget"
            :options="Array.from(budget)"
            placeholder="Sélectionnez un ou plusieurs prix"
            multiple
            option-attribute="name"
            class="flex-grow"
            icon="material-symbols:money-bag-rounded"
        />
        <USelectMenu
            v-model="selectedCategory"
            :options="Array.from(category)"
            placeholder="Sélectionnez une ou plusieurs catégories"
            multiple
            option-attribute="name"
            class="flex-grow"
            icon="bx:bxs-dish"
        />
      </div>
    </div>
    <div>
      <p v-if="status === 'pending'">Veuillez patienter...</p>
      <div v-else-if="status === 'error'">
        <p class="text-lg">Erreur</p>
      </div>
      <div v-else>
        <div
            v-if="correspondingRecipes.length === 0 && (writtenRecipe || selectedCategory.length || selectedDifficulty.length || selectedBudget.length)">
          <p class="text-lg">Aucune recette ne correspond à votre recherche</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="(recipe, index) in paginatedRecipes" :key="recipe.id || index" class="relative">
          <template #header>
              <div class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
                <UIcon name="material-symbols-light:content-copy"
                       class="size-5 text-white hover:text-persian-red-300 transition-colors"
                       @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'copyToClipboard' })"/>
                <UIcon name="material-symbols-light:share"
                       class="size-5 text-white hover:text-persian-red-300 transition-colors"
                       @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'shareToSocial' })"/>
              </div>
              <div class="flex flex-col items-center justify-center space-y-2 pt-4">
                <div class="flex flex-col items-center justify-center">
                  <NuxtLink class="text-lg underline underline-ofset-2" :to="`/recipe/${recipe.slug}`">{{
                      recipe.title
                    }}
                  </NuxtLink>
                  <p class="text-sm text-gray-500">{{ firstCharacterToUppercase(recipe.type.toLowerCase()) }}</p>
                </div>
                <div class="flex justify-center w-full gap-4 cursor-default">
                  <UTooltip text="Temps de préparation" :popper="{ placement: 'top' }">
                    <UBadge color="norway" variant="subtle" class="inline-flex gap-2">
                      <UIcon name="material-symbols:concierge-rounded" class="size-5"/>
                      {{ recipe.preparationTime }}min
                    </UBadge>
                  </UTooltip>
                  <UTooltip text="Temps de cuisson" :popper="{ placement: 'top' }">
                    <UBadge color="serenade" variant="subtle" class="inline-flex gap-2">
                      <UIcon name="ph:cooking-pot-fill" class="size-5"/>
                      {{ recipe.cookingTime }}min
                    </UBadge>
                  </UTooltip>
                  <UTooltip text="Temps de repos" :popper="{ placement: 'top' }">
                    <UBadge color="mercury" variant="subtle" class="inline-flex gap-2">
                      <UIcon name="material-symbols:alarm" class="size-5"/>
                      {{ recipe.restingTime }}min
                    </UBadge>
                  </UTooltip>
                </div>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-between px-2">
                <UTooltip text="Difficulté" :popper="{ placement: 'top' }">
                  <UButton color="gray" class="text-serenade-500">
                    <UIcon name="mdi:chef-hat" class="size-5"/>
                    {{ firstCharacterToUppercase(recipe.difficulty) }}
                  </UButton>
                </UTooltip>
                <UTooltip text="Budget" :popper="{ placement: 'top' }">
                  <UButton color="gray" class="text-norway-500">
                    <UIcon name="material-symbols:money-bag-rounded" class="size-5"/>
                    {{ firstCharacterToUppercase(recipe.budget) }}
                  </UButton>
                </UTooltip>
              </div>
            </template>
          </UCard>
        </div>
        <div class="flex justify-between items-center mt-4" v-if="correspondingRecipes.length">
          <button
              :disabled="currentPage === 1"
              @click="goToPreviousPage"
              class="bg-persian-red text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Précédent
          </button>
          <p>Page {{ currentPage }} / {{ totalPages }}</p>
          <button
              :disabled="currentPage === totalPages || totalPages === 0"
              @click="goToNextPage"
              class="bg-persian-red text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
