<script setup lang="ts">
import { reactive } from 'vue';
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod';
import { searchSpecialEventsRecipes } from '../validation/schemas';
import { SpecialEvents, type Recipes } from '@prisma/client';

console.log(Object.values(SpecialEvents) as [SpecialEvents, ...SpecialEvents[]])

type Schema = z.output<typeof searchSpecialEventsRecipes>

const state = reactive({
  eventType: undefined,
})

const { data } = useFetch<Recipes[]>('/api/get-special-events');

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<template>
  <UForm :schema="searchSpecialEventsRecipes" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Type d'évènement" name="eventType">
      <USelectMenu
      label="Choisissez un évènement"
      name="eventType"
      :options="data?.map((event) => event.specialEvent).filter((event) => event !== null)"
      placeholder="Sélectionnez un événement"
      v-model="state.eventType"
    />
    </UFormGroup>
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
