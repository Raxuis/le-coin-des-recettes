<script setup lang="ts">
import { reactive } from 'vue';
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod';
import { searchSpecialEventsRecipes } from '@/validation/schemas';
import { formatEventType, firstCharacterToUppercase } from '@/utils/textFormatting';
import { SPECIAL_EVENTS } from '@/constants';
import { useFetch } from '#app';
import {type Recipes} from '@prisma/client';
import { onBeforeRouteLeave } from 'vue-router';
import { previousRoute } from '@/utils/previousRoute';

type Schema = z.output<typeof searchSpecialEventsRecipes>;
const correspondingRecipes = ref<Recipes[]>([]);

const state = reactive({
  eventType: undefined,
  formSubmitted: false,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  state.formSubmitted = true;
  const { eventType } = event.data;
  try {
    const response = await useFetch('/api/get-special-events', {
      method: 'POST',
      body: JSON.stringify({ eventType }),
    })
    if (response.status.value === "success" && Array.isArray(response.data.value)) {
      correspondingRecipes.value = response.data.value.map((recipe) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt),
      }));
    } else {
      correspondingRecipes.value = [];
      state.eventType = undefined;
    }
  } catch (error) {
    console.log(error)
  }
}

onBeforeRouteLeave((to, from, next) => {
  previousRoute.value = from.fullPath;
  next();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
  <UForm :schema="searchSpecialEventsRecipes" :state="state" class="w-full space-y-2" @submit.prevent="onSubmit">
    <UFormGroup label="Type d'évènement" name="eventType">
      <USelectMenu
      label="Choisissez un évènement"
      name="eventType"
      :options="SPECIAL_EVENTS.filter((event) => event !== null)"
      placeholder="Sélectionnez un événement"
      v-model="state.eventType"
    />
    </UFormGroup>
    <UButton type="submit" :disabled="!state.eventType">
      Submit
    </UButton>
  </UForm>
  <div v-if="correspondingRecipes.length" class="flex flex-col items-center justify-center space-y-6">
    <p class="text-xl">Voici des recettes pour {{ formatEventType(state.eventType || 'inconnu') }}.</p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="recipe in correspondingRecipes.slice(0, 30)" :key="recipe.id">
        <template #header>
          <div class="flex flex-col items-center justify-center space-y-2">
            <div class="flex flex-col items-center justify-center">
              <NuxtLink class="text-lg underline underline-ofset-2" :to="`/recipe/${recipe.slug}`">{{ recipe.title }}</NuxtLink>
              <p class="text-sm text-gray-500">{{ firstCharacterToUppercase(recipe.type.toLowerCase()) }}</p>
            </div>
            <div class="flex justify-center w-full gap-4 cursor-default">
              <UTooltip text="Temps de préparation" :popper="{ placement: 'top' }">
                <UBadge color="norway" variant="subtle" class="inline-flex gap-2"><UIcon name="material-symbols:concierge-rounded" class="size-5"/>{{ recipe.preparationTime }}min
                </UBadge>
              </UTooltip>
              <UTooltip text="Temps de cuisson" :popper="{ placement: 'top' }">
                <UBadge color="serenade" variant="subtle" class="inline-flex gap-2"><UIcon name="ph:cooking-pot-fill" class="size-5"/>{{ recipe.cookingTime }}min
                </UBadge>
              </UTooltip>
              <UTooltip text="Temps de repos" :popper="{ placement: 'top' }">
                <UBadge color="mercury" variant="subtle" class="inline-flex gap-2"><UIcon name="material-symbols:alarm" class="size-5"/>{{ recipe.restingTime }}min
                </UBadge>
              </UTooltip>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
  <div v-if="state.formSubmitted && correspondingRecipes.length === 0">
    <p class="text-lg">Aucune recette ne correspond à votre recherche.</p>
  </div>
</div>
</template>
