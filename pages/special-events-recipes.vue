<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod';
import { searchSpecialEventsRecipes } from '../validation/schemas';
import type { Recipes } from '@prisma/client';

type Schema = z.output<typeof searchSpecialEventsRecipes>

const state = reactive({
  eventType: "",
})

const specialEventSelected = ref<string>("");
const { data} = useFetch<Recipes[]>('/api/get-special-events');

console.log(data)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="searchSpecialEventsRecipes" :state="state" class="space-y-4" @submit="onSubmit">
    <USelectMenu label="Choisissez un évènement" name="eventType" :options="data?.map((event) => ({ label: event.specialEvent, value: event.specialEvent }))" placeholder="Sélectionnez un événement" />
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
