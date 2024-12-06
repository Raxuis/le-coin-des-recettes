import {ref} from 'vue'
import type {RatingResponse} from "~/utils/types";

export function useRecipeRating(recipeId: string) {
    const rating = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const toast = useToast();

    const submitRating = async (value: number) => {
        try {
            isLoading.value = true
            const {data: response} = await useFetch(`/api/recipe/submit-rating`, {
                method: 'POST',
                body: {ratingValue: value, recipeId}
            })

            if (response.value?.statusCode === 201) {
                toast.add({
                    title: '⭐️ C\'est noté ⭐️',
                    description: 'Merci d\'avoir donné votre avis !',
                    color: 'yellow',
                })
                rating.value = value
            } else {
                console.log(response.value?.statusCode);
                toast.add({
                    title: 'Erreur',
                    description: 'Une erreur est survenue, veuillez réessayer...',
                    icon: 'material-symbols:error',
                    color: 'red',
                })
            }
        } catch (e) {
            error.value = 'Erreur lors de la soumission de la note'
        } finally {
            isLoading.value = false
        }
    }

    const loadRating = async () => {
        const {data: userInfos} = useAuth();
        try {
            isLoading.value = true;
            const {data: response} = await useFetch<RatingResponse>(`/api/recipe/rating`, {
                method: 'POST',
                body: {
                    userEmail: userInfos?.value?.user?.email,
                    recipeId
                }
            });

            if (response.value?.data) {
                console.log(response.value.data)
                rating.value = response.value.data.value;
            }
        } catch (e) {
            error.value = 'Erreur lors du chargement des commentaires';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        rating,
        isLoading,
        error,
        loadRating,
        submitRating,
    }
}
