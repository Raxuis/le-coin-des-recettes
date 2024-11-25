<script setup lang="ts">
import {ref} from "vue";
import {firstCharacterToUppercase, parseList} from "~/utils/textFormatting";
import {type OwnRecipesDatas} from "@/utils/types";
import {useToast} from "#ui/composables/useToast";
import EditModal from "~/components/EditModal.vue";
import {z} from "zod";
import {newRecipe} from "~/validation/schemas";
import {useFetch} from "#app";
import {slugTitle} from "~/utils/titleToSlug";
import type {Recipes} from "@prisma/client";

let isSaving = false;
const {data: authDatas} = useAuth();
const recipes = ref<OwnRecipesDatas[]>([]);
const loading = ref(false);
const toast = useToast();
const modal = useModal();

type Schema = z.output<typeof newRecipe>;

const state = reactive({
  title: '',
  type: '',
  people: 0,
  ingredients: '',
  steps: '',
  preparationTime: 0,
  restingTime: 0,
  cookingTime: 0,
  difficulty: undefined,
  budget: undefined,
  specialEvent: undefined,
});

const totalTime = computed(() => {
  return state.preparationTime + state.restingTime + state.cookingTime;
});

const fetchRecipes = async () => {
  const {data, status} = await useFetch<{ recipes: UpdateOwnRecipesDatas[] }>('/api/own-recipes', {
    query: {email: authDatas.value?.user?.email},
  });
  if (status.value == "success" && data.value) {
    recipes.value = data.value.recipes.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.join(', '),
      steps: recipe.steps.join(', '),
      specialEvent: recipe.specialEvent || undefined,
    }));
  }
};

await fetchRecipes();

const openModal = (recipe: OwnRecipesDatas) => {
  console.log("openModal", recipe);
  Object.assign(state, {...recipe});
  modal.open(EditModal, {
    formState: state,
    onSubmit: saveRecipe,
  });
};

const closeModal = () => {
  modal.close();
}

const saveRecipe = async (updatedRecipe: Schema) => {
  if (isSaving) return; // to fix issue due to the verification with specialEvent
  isSaving = true;
  try {
    loading.value = true;
    const userInfos = await useFetch('/api/profile', {query: {email: authDatas.value?.user?.email}});

    if (userInfos.data.value) {
      const {name, id}: { name: string; id: string } = userInfos.data.value;
      const titleToSlug = slugTitle(updatedRecipe.title);

      const updatedRecipeWithAddedValues = {
        ...updatedRecipe,
        ingredients: parseList(updatedRecipe.ingredients),
        steps: parseList(updatedRecipe.steps),
        author: name,
        creatorId: id,
        totalTime: totalTime.value,
        slug: titleToSlug
      } as Recipes;

      const {data, status} = await useFetch('/api/update-own-recipe', {
        method: 'PUT',
        body: updatedRecipeWithAddedValues,
      });

      if (status.value === 'success' && data.value?.statusCode === 201) {
        toast.add({
          title: 'Mis à jour',
          description: 'La recette a été mise à jour avec succès !',
          icon: 'material-symbols:check-circle',
          color: 'norway',
        });
        const index = recipes.value.findIndex((r) => r.id === updatedRecipeWithAddedValues.id);
        if (index !== -1) recipes.value[index] = {...recipes.value[index], ...updatedRecipe};
        closeModal();
      } else {
        toast.add({
          title: 'Erreur',
          description: data?.value?.statusMessage ?? "Erreur lors de la mise à jour !",
          icon: 'material-symbols:error-circle-rounded-sharp',
          color: 'red',
        });
      }
    } else {
      throw new Error("Utilisateur non trouvé.");
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
  } finally {
    loading.value = false;
    isSaving = false;
  }
};


const deleteRecipeFromId = async (recipeId: string) => {
  loading.value = true;
  try {
    const {data, status} = await useFetch('/api/delete-own-recipe', {
      method: "DELETE",
      body: {
        email: authDatas.value?.user?.email,
        id: recipeId,
      },
    });

    if (status.value == "success" && data.value?.statusCode === 200) {
      toast.add({
        title: 'Supprimé',
        description: 'Recette supprimée avec succès !',
        icon: 'material-symbols:delete',
        color: 'norway'
      })
      recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeId);
    } else {
      toast.add({
        title: 'Erreur',
        description: data.value?.statusMessage ?? "Erreur lors de la suppression!",
        icon: 'material-symbols:error-circle-rounded-sharp',
        color: 'red'
      })
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Impossible de supprimer la recette pour le moment.");
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <p class="text-xl">Vos recettes :</p>
  <div class="mt-8">
    <p v-if="!recipes.length && !loading">Aucune recette trouvée.</p>
    <p v-if="loading">Chargement...</p>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
          v-for="recipe in recipes"
          :key="recipe.id"
          class="relative group"
      >
        <template #header>
          <div class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
            <UIcon name="material-symbols:edit-outline"
                   class="size-5 text-white hover:text-blue-500 opacity-0 group-hover:opacity-100 duration-300"
                   @click="openModal(recipe)"
            />
            <UIcon name="ic:baseline-delete"
                   class="size-5 text-white hover:text-persian-red-500 opacity-0 group-hover:opacity-100 duration-300"
                   @click="deleteRecipeFromId(recipe.id)"
            />
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 max-sm:pt-4">
            <div class="flex flex-col items-center justify-center">
              <NuxtLink class="text-lg underline underline-offset-2" :to="`/recipe/${recipe.slug}`">
                {{ recipe.title }}
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
  </div>
</template>