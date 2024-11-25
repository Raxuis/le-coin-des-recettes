<script setup lang="ts">
import type {FormSubmitEvent} from '#ui/types'
import {z} from 'zod';
import {newRecipe} from '@/validation/schemas';
import {firstCharacterToUppercase, previousRoute, useAuth} from "#imports";
import {parseList} from "~/utils/textFormatting";
import {useFetch} from "#app";
import type {Recipes} from "@prisma/client";
import {onBeforeRouteLeave} from "#vue-router";
import {slugTitleWithTimeStamp} from "~/utils/titleToSlug";

const {data: userDatas} = useAuth();

const {data} = useFetch<Recipes[]>('/api/community-recipes', {
  default: () => [], // making data an array by default
});

const isOpen = ref(false);
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
    } as Recipes;
    const response = await useFetch('/api/new-recipe', {
      method: 'POST',
      body: JSON.stringify(newRecipe)
    })
    if (response.status.value === "success") {
      toast.add({
        title: 'Félicitations',
        description: 'Vous avez créé une recette !',
        icon: 'material-symbols:content-copy',
        color: 'green'
      })
      isOpen.value = false;

      data.value.push(newRecipe);
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

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      <UCard v-for="recipe in data" :key="recipe.id" class="relative">
        <template #header>
          <div class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
            <UIcon name="material-symbols-light:content-copy"
                   class="size-5 text-white hover:text-persian-red-300 transition-colors"
                   @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'copyToClipboard' })"/>
            <UIcon name="material-symbols-light:share"
                   class="size-5 text-white hover:text-persian-red-300 transition-colors"
                   @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'shareToSocial' })"/>
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 max-sm:pt-4">
            <div class="flex flex-col items-center justify-center">
              <NuxtLink class="text-lg underline underline-offset-2" :to="`/recipe/${recipe.slug}`">{{
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
  </div>
  <div class="flex flex-col justify-center items-center py-10 sm:py-20">
    <p v-if="userDatas?.user?.email" class="text-center">Vous souhaitez voir celles que vous avez fait ?</p>
    <NuxtLink class="text-serenade-700 dark:text-serenade-200" to="/own-recipes">Cliquez ici</NuxtLink>
  </div>
</template>
