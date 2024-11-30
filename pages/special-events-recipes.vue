<script setup lang="ts">
import {reactive} from 'vue';
import type {FormSubmitEvent} from '#ui/types'
import {z} from 'zod';
import {searchSpecialEventsRecipes} from '@/validation/schemas';
import {formatEventType, firstCharacterToUppercase} from '@/utils/textFormatting';
import {SPECIAL_EVENTS} from '@/constants';
import {useFetch} from '#app';
import type {RecipesProps} from "~/utils/types";
import {onBeforeRouteLeave} from 'vue-router';
import {previousRoute} from '@/utils/previousRoute';
import {mapToRecipesProps} from "~/utils/recipeFunctions";

type Schema = z.output<typeof searchSpecialEventsRecipes>;
const correspondingRecipes = ref<RecipesProps[]>([]);

const state = reactive({
  eventType: undefined,
  formSubmitted: false,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  state.formSubmitted = true;
  const {eventType} = event.data;
  try {
    const response = await useFetch('/api/get-special-events', {
      method: 'POST',
      body: JSON.stringify({eventType}),
    })
    if (response.status.value === "success" && Array.isArray(response.data.value)) {
      correspondingRecipes.value = mapToRecipesProps(response.data.value);
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
            :options="[...SPECIAL_EVENTS]"
            placeholder="Sélectionnez un événement"
            v-model="state.eventType"
        />
      </UFormGroup>
      <UButton type="submit" :disabled="!state.eventType">
        Rechercher
      </UButton>
    </UForm>
    <div v-if="correspondingRecipes.length" class="flex flex-col items-center justify-center space-y-6">
      <p class="text-xl">Voici des recettes pour {{ formatEventType(state.eventType || 'inconnu') }}.</p>
      <RecipesGrid :recipes="correspondingRecipes" />
    </div>
    <div v-if="state.formSubmitted && correspondingRecipes.length === 0">
      <p class="text-lg">Aucune recette ne correspond à votre recherche.</p>
    </div>
  </div>
</template>
