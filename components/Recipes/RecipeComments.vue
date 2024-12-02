<script setup lang="ts">

const props = defineProps<{
  recipeId: string;
}>();

const {
  comments,
  newComment,
  isLoading,
  error,
  submitComment,
  loadComments
} = useRecipeComments(props.recipeId);

onMounted(() => {
  loadComments();
});
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Commentaires</h3>

    <!-- Comment Input -->
    <div class="space-y-2">
      <textarea
          v-model="newComment"
          placeholder="Partagez votre expérience avec cette recette..."
          class="w-full p-3 border rounded-md focus:ring-2 focus:ring-serenade-600 focus:border-transparent"
          rows="3"
      />
      <UButton
          :loading="isLoading"
          @click="submitComment"
          color="serenade"
          class="w-full sm:w-auto"
      >
        Ajouter un commentaire
      </UButton>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500">{{ error }}</p>

    <!-- Comments List -->
    <div v-if="comments.length > 0" class="space-y-4">
      <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-4 bg-gray-50 rounded-md"
      >
        <p class="text-gray-800">{{ comment.text }}</p>
        <div class="flex justify-between mt-2 text-sm text-gray-500">
          <span>{{ comment.authorName }}</span>
          <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
    <p v-else-not-loading class="text-gray-500 italic">
      Aucun commentaire pour le moment
    </p>
  </div>
</template>