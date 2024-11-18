<template>
  <USlideover
      class="overflow-y-auto"
      :model-value="isOpen"
      @update:model-value="handleModelUpdate">
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
                   @click="closeSidebar"
          />
        </div>
      </template>

      <div class="h-full">
        <UForm :schema="newRecipe" :state="formState" class="w-full space-y-2" @submit.prevent="onSubmit">
          <UFormGroup label="Nom de la recette" name="title">
            <UInput v-model="formState.title" placeholder="Nom de la recette" name="title" required/>
          </UFormGroup>

          <UFormGroup label="Catégorie de recette" name="type">
            <USelectMenu
                label="Choisissez une catégorie"
                name="type"
                :options="Array.from(category)"
                placeholder="Sélectionnez une catégorie"
                v-model="formState.type"
            />
          </UFormGroup>

          <UFormGroup label="Ingrédients" name="ingredients">
            <UInput v-model="formState.ingredients" placeholder="Liste des ingrédients séparés par des virgules"
                    name="ingredients"/>
          </UFormGroup>

          <UFormGroup label="Étapes" name="steps">
            <UInput v-model="formState.steps" placeholder="Liste des étapes séparées par des points-virgules"
                    name="steps"/>
          </UFormGroup>

          <UFormGroup label="Nombre de personnes" name="people">
            <UInput type="number" v-model="formState.people" placeholder="Nombre de personnes" name="people"/>
          </UFormGroup>

          <UFormGroup label="Temps de préparation (min)" name="preparationTime">
            <UInput type="number" v-model="formState.preparationTime" placeholder="Temps de préparation"
                    name="preparationTime" required/>
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Temps de repos (min)" name="restingTime">
              <UInput type="number" v-model="formState.restingTime" placeholder="Temps de repos" name="restingTime"/>
            </UFormGroup>
            <UFormGroup label="Temps de cuisson (min)" name="cookingTime">
              <UInput type="number" v-model="formState.cookingTime" placeholder="Temps de cuisson" name="cookingTime"
                      required/>
            </UFormGroup>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Difficulté" name="difficulty">
              <USelectMenu
                  label="Choisissez une difficulté"
                  name="difficulty"
                  :options="Array.from(difficulty)"
                  v-model="formState.difficulty"
                  required
              />
            </UFormGroup>

            <UFormGroup label="Budget" name="budget">
              <USelectMenu
                  label="Choisissez un budget"
                  name="budget"
                  :options="Array.from(budget)"
                  v-model="formState.budget"
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
                v-model="formState.specialEvent"
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
</template>

<script setup lang="ts">
import { newRecipe } from "~/validation/schemas";
import type { FormSubmitEvent } from "#ui/types";
import {budget, category, difficulty, SPECIAL_EVENTS} from '@/constants';

const { isOpen, formState, onSubmit } = defineProps<{
  isOpen: boolean;
  formState: Record<string, any>;
  onSubmit: (event: FormSubmitEvent<any>) => void;
}>();

const emit = defineEmits(['update:isOpen']);

function closeSidebar() {
  emit('update:isOpen', false);
}

function handleModelUpdate(value: boolean) {
  emit('update:isOpen', value);
}
</script>
