<script setup lang="ts">
import {firstCharacterToUppercase} from "~/utils/textFormatting";
import {type OwnRecipesDatas} from '@/utils/types';

const {data: authDatas} = useAuth();

const {data, status} = await useFetch<OwnRecipesDatas[]>('/api/own-recipes', {
  query: {email: authDatas.value?.user?.email}
});

console.log(data);

</script>

<template>
  <p class="text-xl">Vos recettes :</p>
  <div class="mt-8">
    <p v-if="status === 'pending'">Veuillez patienter...</p>
    <div v-else-if="status === 'error'">
      <p class="text-lg">Erreur</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="flex flex-col items-center justify-center space-y-4" v-if="!data">
        <p>Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre profil.</p>
        <UButton href="/auth/signIn" color="white" label="Se connecter" trailing-icon="material-symbols:login"/>
      </div>
      <UCard v-for="recipe in data?.recipes" :key="recipe.id" class="relative group" v-else>
        <template #header>
          <div class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
            <UIcon name="material-symbols:edit-outline"
                   class="size-5 text-white hover:text-blue-500 opacity-0 group-hover:opacity-100 duration-300"/>
            <UIcon name="ic:baseline-delete"
                   class="size-5 text-white hover:text-persian-red-500 opacity-0 group-hover:opacity-100 duration-300"/>
          </div>
          <div class="flex flex-col items-center justify-center space-y-2 max-sm:pt-4">
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
  </div>
</template>