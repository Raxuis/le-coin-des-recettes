import { ref } from 'vue'

export function useRecipeRating(recipeId: string) {
    const rating = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const submitRating = async (value: number) => {
        try {
            isLoading.value = true
            const response = await useFetch(`/api/recipes/${recipeId}/ratings`, {
                body: { rating: value }
            })
            rating.value = value
        } catch (e) {
            error.value = 'Erreur lors de la soumission de la note'
        } finally {
            isLoading.value = false
        }
    }

    return {
        rating,
        isLoading,
        error,
        submitRating
    }
}
