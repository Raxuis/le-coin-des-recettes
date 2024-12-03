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

loadComments();
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">Commentaires</h3>

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
          class="w-full sm:w-auto block"
      >
        Ajouter un commentaire
      </UButton>
    </div>

    <p v-if="error" class="text-red-500">{{ error }}</p>

    <div v-if="comments.length > 0" class="space-y-4">
      <div
          v-for="comment in comments"
          :key="comment.id"
          class="p-4 bg-gray-300 rounded-md"
      >
        <p class="text-gray-800">{{ comment.content }}</p>
        <div class="flex justify-between mt-2 text-sm text-gray-500">
          <!-- To change from /profile to /profile/id-->
          <NuxtLink to="/profile" class="flex items-center gap-2">
            <div
                class="flex relative bg-gray-300 hover:bg-persian-red-400 text-persian-red-400 hover:text-white rounded-full transition-colors"
                >
              <UAvatar
                  :src="comment.user.image"
                  alt="User avatar"
                  class="z-10"
                  onerror="this.onerror=null; this.remove();"
              >
              </UAvatar>
              <p class="z-5 absolute inset-0 flex justify-center items-center bg-gray-900 rounded-full">{{ comment.user.name!.charAt(0) }}</p>
            </div>
            <span>{{ comment.user?.name || 'Utilisateur inconnu' }}</span>
          </NuxtLink>
          <span>{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
    <p v-if="!isLoading && comments.length == 0" class="text-gray-500 italic">
      Aucun commentaire pour le moment
    </p>
  </div>
</template>