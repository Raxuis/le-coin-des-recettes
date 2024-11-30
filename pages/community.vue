<script setup lang="ts">
import type {FormSubmitEvent} from '#ui/types'
import {z} from 'zod';
import {newRecipe} from '@/validation/schemas';
import {firstCharacterToUppercase, previousRoute, useAuth} from "#imports";
import {parseList} from "~/utils/textFormatting";
import {useFetch} from "#app";
import {onBeforeRouteLeave} from "#vue-router";
import {slugTitleWithTimeStamp} from "~/utils/titleToSlug";
import {useRecipeFavorites} from "~/composables/useRecipeFavorites";
import type {RecipesProps} from "~/utils/types";
import {isValidRecipe} from "~/utils/recipeFunctions";

const {data: userDatas} = useAuth();
const {toggleFavorite} = useRecipeFavorites()


const {data} = useFetch<RecipesProps[]>('/api/community-recipes', {
  default: () => [], // making data an array by default
});

const isOpen = ref(false);
const isRecipeFavorited = ref<Record<string, boolean>>({});

const fetchFavorites = async () => {
  if (!userDatas.value?.user?.email) return;

  try {
    const {data: userWithFavorites} = await useFetch('/api/user-favorites', {
      query: {email: userDatas.value.user.email}
    });

    const favorites = userWithFavorites.value?.favoriteRecipes ?? [];
    const favoritedMap = Object.fromEntries(
        favorites.map((fav) => [fav.id, true])
    );
    isRecipeFavorited.value = {...favoritedMap};
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
  }
};


fetchFavorites(); // Removed onMounted because issue with useFetch response being idle


const toast = useToast();

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

// 👇 Calculating totalTime from preparationTime, restingTime, cookingTime with computed (similar to useEffect)
const totalTime = computed(() => {
  return state.preparationTime + state.restingTime + state.cookingTime;
});


async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const userInfos = await useFetch('/api/profile', {query: {email: userDatas?.value?.user?.email}});

    const {name, id}: any = userInfos.data.value;

    const newRecipe = {
      ...event.data,
      ingredients: parseList(event.data.ingredients),
      steps: parseList(event.data.steps),
      author: name,
      creatorId: id,
      totalTime: totalTime.value,
      slug: slugTitleWithTimeStamp(state.title)
    } as Partial<RecipesProps>;

    const response = await useFetch('/api/new-recipe', {
      method: 'POST',
      body: JSON.stringify(newRecipe)
    })
    if (response.status.value === "success") {
      const createdRecipe = response.data.value?.data;

      if (createdRecipe && isValidRecipe(createdRecipe)) {
        data.value.push(createdRecipe);
      }

      toast.add({
        title: 'Félicitations',
        description: 'Vous avez créé une recette !',
        icon: 'material-symbols:content-copy',
        color: 'green'
      })
      isOpen.value = false;
    } else if (response.status.value === "error") {
      toast.add({
        title: 'Erreur',
        description: response.error.value?.statusMessage ?? "Erreur",
        icon: 'material-symbols:error',
        color: 'red',
      })
    }
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue.',
      icon: 'material-symbols:error',
      color: 'red',
    });
  }
}

onBeforeRouteLeave((to, from, next) => {
  previousRoute.value = from.fullPath;
  next();
});

const handleFavoriteClick = async (recipeId: string) => {
  const result = await toggleFavorite(recipeId)
  if (result !== undefined) {
    isRecipeFavorited.value[recipeId] = result
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4">
      <p>Ici vous pouvez voir les différentes recettes proposées par la communauté.</p>
      <div
          class="select-none group cursor-pointer text-gray-700 dark:text-white grid grid-flow-col auto-cols-max justify-center bg-clip-border border-2 border-persian-red-300 border-dashed rounded-lg bg-slate-400 bg-opacity-15 hover:bg-persian-red-300 hover:bg-opacity-20 duration-300 p-8"
          @click="isOpen = true"
          v-if="userDatas?.user?.email"
      >
        <p class="flex justify-center items-center">Ajouter votre propre recette
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               class="size-4 ml-1 lucide lucide-chevron-right group-hover:translate-x-1 duration-300">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </p>
      </div>
      <NuxtLink
          class="select-none group cursor-pointer text-gray-700 dark:text-white
          grid grid-flow-col auto-cols-max justify-center bg-clip-border border-2 border-persian-red-300
          border-dashed rounded-lg bg-slate-400 bg-opacity-15 hover:bg-persian-red-300 hover:bg-opacity-20
          duration-300 p-8"
          v-else
          to="/auth/signIn"
      >
        <p class="flex justify-center items-center">Vous devez être connecté pour créer votre propre recette.</p>
      </NuxtLink>
    </div>

    <NewRecipeSlideOver :isOpen="isOpen" :formState="state" :onSubmit="onSubmit"
                        @update:isOpen="(value) => isOpen = value"/>

    <RecipesGrid :recipes="data" />
  </div>
  <div class="flex flex-col justify-center items-center py-10 sm:py-20">
    <p v-if="userDatas?.user?.email" class="text-center">Vous souhaitez voir celles que vous avez fait ?</p>
    <NuxtLink class="text-serenade-700 dark:text-serenade-200" to="/own-recipes">Cliquez ici</NuxtLink>
  </div>
</template>
