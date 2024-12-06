<script setup lang="ts">
const props = defineProps<{
  recipeId: string;
}>();

const {
  rating,
  submitRating,
  loadRating,
  isLoading
} = useRecipeRating(props.recipeId);

loadRating();

const stars = ref([1, 2, 3, 4, 5]);
const hoverRating = ref(0);

// Blocks the user when wanting to rate a recipe again
const canRate = computed(() => rating.value === 0 && !isLoading.value);
</script>


<template>
  <div class="space-y-2">
    <h3 class="text-lg font-semibold">Noter cette recette</h3>
    <div class="flex items-center gap-1">
      <button
          v-for="star in stars"
          :key="star"
          class="focus:outline-none"
          @mouseenter="hoverRating = canRate ? star : hoverRating"
          @mouseleave="hoverRating = canRate ? 0 : hoverRating"
          @click="canRate && submitRating(star)"
          :disabled="!canRate"
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
    <p v-if="rating" class="text-sm text-green-500">
      Vous avez déjà noté cette recette.
    </p>
  </div>
</template>
