import { ref } from 'vue'
import type { RecipeComment } from "~/utils/types";

export function useRecipeComments(recipeId: string) {
  const comments = ref<RecipeComment[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const newComment = ref('');

  const submitComment = async () => {
    if (!newComment.value.trim()) return;

    try {
      isLoading.value = true;
      const { data: response } = await useFetch<SingleCommentResponse>(`/api/recipes/${recipeId}/comments`, {
        method: 'POST',
        body: { text: newComment.value }
      });

      if (response.value?.data) {
        comments.value.unshift(response.value.data);
        newComment.value = '';
      }
    } catch (e) {
      error.value = 'Erreur lors de la soumission du commentaire';
    } finally {
      isLoading.value = false;
    }
  };

  const loadComments = async () => {
    try {
      isLoading.value = true;
      const { data: response } = await useFetch<CommentResponse>(`/api/recipes/${recipeId}/comments`);

      if (response.value?.data) {
        comments.value = response.value.data;
      }
    } catch (e) {
      error.value = 'Erreur lors du chargement des commentaires';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    comments,
    newComment,
    isLoading,
    error,
    submitComment,
    loadComments
  }
}
