<script setup lang="ts">
import { reactive } from 'vue';
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod';
import { searchSpecialEventsRecipes } from '../validation/schemas';
import { SPECIAL_EVENTS } from '~/constants';
import { useFetch } from '#app';

type Schema = z.output<typeof searchSpecialEventsRecipes>

const state = reactive({
  eventType: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { eventType } = event.data;
  try {
    const response = await useFetch('/api/get-special-events', {
      method: 'POST',
      body: JSON.stringify({ eventType }),
    })
    console.log(response.data)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <UForm :schema="searchSpecialEventsRecipes" :state="state" class="space-y-4" @submit.prevent="onSubmit">
    <UFormGroup label="Type d'évènement" name="eventType">
      <USelectMenu
      label="Choisissez un évènement"
      name="eventType"
      :options="SPECIAL_EVENTS.filter((event) => event !== null)"
      placeholder="Sélectionnez un événement"
      v-model="state.eventType"
    />
    </UFormGroup>
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
