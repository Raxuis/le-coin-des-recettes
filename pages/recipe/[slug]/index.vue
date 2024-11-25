<script setup lang="ts">

import {useDark} from "@vueuse/core";

definePageMeta({
  name: 'recipe-slug'
});

import {type Recipes} from '@prisma/client';
import {useFetch} from 'nuxt/app';
import {useRoute, useRouter} from 'vue-router';
import {previousRoute} from '@/utils/previousRoute';
import {firstCharacterToUppercase} from '@/utils/textFormatting';
import {ref} from 'vue';
import {exportToPDF} from '@/utils/exportToPDF';

const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();
const isDarkMode: boolean = colorMode.value !== 'dark';
const recipeSlug = route.params.slug;
const {data, status} = useFetch<Recipes>('/api/recipe', {
  method: 'POST',
  body: {
    slug: recipeSlug
  },
});

function goBack() {
  if (previousRoute.value) {
    router.push(previousRoute.value);
  } else {
    router.push('/');
  }
}

const pdfSection = ref<HTMLElement | null>(null);

const handleExportToPDF = () => {
  if (pdfSection.value) {
    exportToPDF(pdfSection.value, data.value?.slug || "recette");
  }
};
</script>

<template>
  <p v-if="status === 'pending'">
    Veuillez patienter...
  </p>
  <div v-else-if="status === 'error'">
    <p class="text-lg">Erreur</p>
  </div>
  <div ref="pdfSection" v-else>
    <UCard class="font-lora">
      <template #header>
        <div class="flex gap-4 items-center export-hidden">
          <UButton
              icon="material-symbols:arrow-back"
              size="sm"
              color="white"
              square
              variant="solid"
              @click="goBack"
          />
          <UButton
              icon="material-symbols:download"
              size="sm"
              color="white"
              variant="outline"
              @click="handleExportToPDF"
              class="ml-auto"
          >
            Exporter en PDF
          </UButton>
        </div>
      </template>
      <div class="flex flex-col space-y-4">
        <p class="text-2xl">{{ firstCharacterToUppercase(data?.title || "Recette") }}</p>
        <p class="text-sm" v-if="data?.people && data?.people !== 0">Recette pour <span
            class="font-extrabold">{{ data?.people }} personnes</span>.</p>
        <p class="text-lg">Ingrédients :</p>
        <ul class="list-none list-inside space-y-1">
          <li v-for="ingredient in data?.ingredients" :key="ingredient">
            - {{ firstCharacterToUppercase(ingredient) }}
          </li>
        </ul>
        <hr/>
        <p class="text-lg">Étapes :</p>
        <ol class="list-decimal list-inside space-y-1">
          <li v-for="step in data?.steps" :key="step">
            {{ step }}
          </li>
        </ol>
        <div v-if="data?.creatorId">
          <hr/>
          <p class="pt-2">Par <span class="text-serenade-600">{{ data.author }}</span></p>
        </div>
      </div>
    </UCard>
  </div>
</template>
