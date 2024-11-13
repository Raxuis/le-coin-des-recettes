<script setup lang="ts">
import type {FormSubmitEvent} from '#ui/types'
import {z} from 'zod';
import {budget, category, difficulty, SPECIAL_EVENTS} from '@/constants';
import {newRecipe} from '@/validation/schemas';

const isOpen = ref(false);

type Schema = z.output<typeof newRecipe>;

const state = reactive({
  title: '',
  eventType: '',
  people: 0,
  ingredients: '',
  steps: '',
  preparationTime: 0,
  restingTime: 0,
  cookingTime: 0,
  difficulty: undefined,
  budget: undefined,
  specialEvent: undefined,
  slug: '',
});

// 👇 Calculating totalTime from preparationTime, restingTime, cookingTime with computed (similar to useEffect)
const totalTime = computed(() => {
  return state.preparationTime + state.restingTime + state.cookingTime;
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  console.log(totalTime.value);
}
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4">
      <p>Ici vous pouvez voir les différentes recettes proposées par la communauté.</p>
      <div
          class="select-none group cursor-pointer text-gray-700 dark:text-white grid grid-flow-col auto-cols-max justify-center bg-clip-border border-2 border-persian-red-300 border-dashed rounded-lg bg-slate-400 bg-opacity-15 hover:bg-persian-red-300 hover:bg-opacity-20 duration-300 p-8"
          @click="isOpen = true">
        <p class="flex justify-center items-center">Ajouter votre propre recette
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round"
               class="size-4 ml-1 lucide lucide-chevron-right group-hover:translate-x-1 duration-300">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </p>
      </div>
    </div>
    <USlideover v-model="isOpen" class="overflow-y-auto">
      <UCard
          class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Création de votre recette
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                     class="-my-1 focus-visible:ring-persian-red-400 dark:focus-visible:ring-persian-red-400"
                     @click="isOpen = false"/>
          </div>
        </template>

        <div class="h-full">
          <UForm :schema="newRecipe" :state="state" class="w-full space-y-2" @submit.prevent="onSubmit">
            <UFormGroup label="Nom de la recette" name="title">
              <UInput v-model="state.title" placeholder="Nom de la recette" name="title" required/>
            </UFormGroup>

            <UFormGroup label="Slug (optionnel)" name="slug">
              <UInput type="input" v-model="state.slug" placeholder="Slug (/slug)" name="slug" required/>
            </UFormGroup>

            <UFormGroup label="Catégorie de recette" name="eventType">
              <USelectMenu
                  label="Choisissez une catégorie"
                  name="eventType"
                  :options="Array.from(category)"
                  placeholder="Sélectionnez une catégorie"
                  v-model="state.eventType"
              />
            </UFormGroup>

            <UFormGroup label="Ingrédients" name="ingredients">
              <UInput v-model="state.ingredients" placeholder="Liste des ingrédients séparés par des virgules"
                      name="ingredients"/>
            </UFormGroup>

            <UFormGroup label="Étapes" name="steps">
              <UInput v-model="state.steps" placeholder="Liste des étapes séparées par des points-virgules"
                      name="steps"/>
            </UFormGroup>

            <UFormGroup label="Nombre de personnes" name="people">
              <UInput type="number" v-model="state.people" placeholder="Nombre de personnes" name="people"/>
            </UFormGroup>

            <UFormGroup label="Temps de préparation (min)" name="preparationTime">
              <UInput type="number" v-model="state.preparationTime" placeholder="Temps de préparation"
                      name="preparationTime" required/>
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Temps de repos (min)" name="restingTime">
                <UInput type="number" v-model="state.restingTime" placeholder="Temps de repos" name="restingTime"/>
              </UFormGroup>
              <UFormGroup label="Temps de cuisson (min)" name="cookingTime">
                <UInput type="number" v-model="state.cookingTime" placeholder="Temps de cuisson" name="cookingTime"
                        required/>
              </UFormGroup>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Difficulté" name="difficulty">
                <USelectMenu
                    label="Choisissez une difficulté"
                    name="difficulty"
                    :options="Array.from(difficulty)"
                    v-model="state.difficulty"
                    required
                />
              </UFormGroup>

              <UFormGroup label="Budget" name="budget">
                <USelectMenu
                    label="Choisissez un budget"
                    name="eventType"
                    :options="Array.from(budget)"
                    v-model="state.budget"
                    required
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Évènement spécial (optionnel)" name="specialEvent">
              <USelectMenu
                  label="Choisissez un évènement"
                  name="specialEvent"
                  :options="Array.from(SPECIAL_EVENTS)"
                  placeholder="Sélectionnez un événement"
                  v-model="state.specialEvent"
              />
            </UFormGroup>

            <UButton type="submit" color="persian-red"
                     class="text-white dark:text-white bg-persian-red-500 dark:bg-persian-red-500">
              Ajouter la recette
            </UButton>
          </UForm>
        </div>

        <template #footer>
          <p class="text-center text-xs">Votre nom sera visible par tous les membres de la communauté.</p>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>
