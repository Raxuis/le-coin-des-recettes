import {ref} from 'vue'
import type {RecipeComment} from "~/utils/types";
import {comment} from "~/validation/schemas";
import {ZodError} from "zod";

export function useRecipeComments(recipeId: string) {
    const comments = ref<RecipeComment[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const newComment = ref('');

    const submitComment = async () => {
        const trimmedComment = newComment.value.trim();

        try {
            comment.parse({comment: trimmedComment});
            error.value = null;

            isLoading.value = true;
            const {data: response} = await useFetch<SingleCommentResponse>(`/api/recipe/comments/${recipeId}`, {
                method: 'POST',
                body: {content: trimmedComment},
            });

            if (response.value?.data) {
                comments.value.unshift(response.value.data);
                newComment.value = '';
            }
        } catch (validationError) {
            if (validationError instanceof ZodError) {
                error.value = validationError.errors[0]?.message || 'Invalid comment.';
            } else {
                error.value = 'Erreur lors de la soumission du commentaire';
            }
        } finally {
            isLoading.value = false;
        }
    };


    const loadComments = async () => {
        try {
            isLoading.value = true;
            const {data: response} = await useFetch<CommentResponse>(`/api/recipe/comments/${recipeId}`);

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
