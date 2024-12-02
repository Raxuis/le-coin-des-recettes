<script setup lang="ts">
const props = defineProps<{
  recipeId: string;
}>();

const { rating, submitRating, isLoading } = useRecipeRating(props.recipeId);
const stars = ref([1, 2, 3, 4, 5]);
const hoverRating = ref(0);
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-lg font-semibold">Noter cette recette</h3>
    <div class="flex items-center gap-1">
      <button
          v-for="star in stars"
          :key="star"
          class="focus:outline-none"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          @click="submitRating(star)"
          :disabled="isLoading"
      >
        <Icon
            name="material-symbols:star"
            class="w-8 h-8 transition-colors"
            :class="[
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          ]"
        />
      </button>
      <span class="ml-2 text-sm text-gray-600">
        {{ rating ? `${rating} sur 5` : 'Pas encore noté' }}
      </span>
    </div>
  </div>
</template>
