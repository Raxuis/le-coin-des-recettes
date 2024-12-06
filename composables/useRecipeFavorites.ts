export const useRecipeFavorites = () => {
    const { data: authData } = useAuth()
    const toast = useToast()

    const toggleFavorite = async (recipeId: string) => {
        if (!authData.value?.user?.email) {
            toast.add({
                title: 'Erreur',
                description: 'Vous devez être connecté pour ajouter une recette à vos favoris',
                icon: 'material-symbols:error',
                color: 'red',
            })
            return false
        }

        try {
            const userInfos = await useFetch('/api/profile', {
                query: { email: authData.value.user.email }
            })

            if (!userInfos.data.value?.id) {
                throw new Error('User ID not found')
            }

            const response = await useFetch('/api/toggle-favorite', {
                method: 'POST',
                body: {
                    recipeId,
                    userId: userInfos.data.value.id
                }
            })

            if (response.status.value === "success") {
                toast.add({
                    title: response.data?.value?.isFavorited ? 'Ajouté aux favoris' : 'Retiré des favoris',
                    description: response.data?.value?.isFavorited
                        ? 'La recette a été ajoutée à vos favoris'
                        : 'La recette a été retirée de vos favoris',
                    icon: response.data?.value?.isFavorited ? 'material-symbols:star' : 'material-symbols:star-outline',
                    color: 'yellow',
                })
                return response.data?.value?.isFavorited
            }
        } catch (error) {
            console.error(error)
            toast.add({
                title: 'Erreur',
                description: 'Une erreur est survenue 😕',
                icon: 'material-symbols:error',
                color: 'red',
            })
            return false
        }
    }

    return {
        toggleFavorite
    }
}