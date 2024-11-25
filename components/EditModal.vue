<script lang="ts" setup>
import { defineEmits } from 'vue';
import { newRecipe } from '~/validation/schemas';
import { budget, category, difficulty, SPECIAL_EVENTS } from '~/constants';

const { formState } = defineProps<{
  formState: Record<string, any>;

}>();

const emit = defineEmits(['submit']);

const onSubmit = () => {
  emit('submit', { ...formState });
};
</script>


<template>
  <UModal>
    <div class="p-4">
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

        <UButton type="submit" @click="onSubmit" color="persian-red">
          Enregistrer les modifications
        </UButton>
      </UForm>
    </div>
  </UModal>
</template>