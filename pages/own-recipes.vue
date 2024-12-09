<script setup lang="ts">
import {ref} from "vue";
import {parseList} from "~/utils/textFormatting";
import {type OwnRecipesDatas} from "@/utils/types";
import {useToast} from "#ui/composables/useToast";
import EditRecipeModal from "~/components/EditRecipeModal.vue";
import {z} from "zod";
import {newRecipe} from "~/validation/schemas";
import {useFetch} from "#app";
import {slugTitleWithTimeStamp} from "~/utils/titleToSlug";
import {onBeforeRouteLeave} from "#vue-router";
import {previousRoute} from "~/utils/previousRoute";
import {closeModal} from "~/utils/modal";

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
  Object.assign(state, {...recipe});
  modal.open(EditRecipeModal, {
    formState: state,
    onSubmit: saveRecipe,
  });
};

const saveRecipe = async (updatedRecipe: Schema) => {
  if (isSaving) return; // to fix issue due to the verification with specialEvent
  isSaving = true;
  try {
    loading.value = true;
    const userInfos = await useFetch('/api/profile', {query: {email: authDatas.value?.user?.email}});

    if (userInfos.data.value) {
      const {name, id}: { name: string; id: string } = userInfos.data.value;
      const titleToSlug = slugTitleWithTimeStamp(updatedRecipe.title);

      const updatedRecipeWithAddedValues = {
        ...updatedRecipe,
        ingredients: parseList(updatedRecipe.ingredients),
        steps: parseList(updatedRecipe.steps),
        author: name,
        creatorId: id,
        totalTime: totalTime.value,
        slug: titleToSlug
      };

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
onBeforeRouteLeave((to, from, next) => {
  previousRoute.value = from.fullPath;
  next();
});
</script>


<template>
  <p class="text-xl">Vos recettes :</p>
  <div class="mt-8">
    <RecipesGrid
        :recipes="recipes"
        :loading="loading"
        @edit="openModal"
        @delete="deleteRecipeFromId"
    />
  </div>
</template>