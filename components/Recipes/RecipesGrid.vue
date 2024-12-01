<script setup lang="ts">
import type {OwnRecipesDatas, RecipesProps} from '~/utils/types';
import {useRoute} from 'vue-router';
import {useAuth} from '#imports';
import RecipeCard from "~/components/Recipes/RecipeCard.vue";

interface Props {
  recipes: RecipesProps[] | OwnRecipesDatas[];
  loading?: boolean;
}

defineProps<Props>();
const route = useRoute();
const {data: userDatas} = useAuth();

const isOwnRecipesView = computed(() => route.path === '/own-recipes');
const showSocialActions = computed(() => {
  return ['/community', '/recipes', '/special-events-recipes'].includes(route.path);
});

const isRecipeFavorited = ref<Record<string, boolean>>({});
const isFavoritesLoading = ref(true);

const fetchFavorites = async () => {
  if (!userDatas.value?.user?.email) {
    isFavoritesLoading.value = false;
    return;
  }

  try {
    const {data: userWithFavorites} = await useFetch('/api/user-favorites', {
      query: {email: userDatas.value.user.email}
    });

    const favorites = userWithFavorites.value?.favoriteRecipes ?? [];
    const favoritedMap = Object.fromEntries(
        favorites.map((fav) => [fav.id, true])
    );
    isRecipeFavorited.value = {...favoritedMap};
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris :", error);
  } finally {
    isFavoritesLoading.value = false;
  }
};


fetchFavorites();

</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
    <p v-if="!recipes.length && !loading">Aucune recette trouvée.</p>
    <p v-if="loading">Chargement...</p>
    <template v-else>
      <div v-if="isFavoritesLoading && userDatas?.user?.email">Chargement des favoris...</div>
      <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          :show-social-actions="showSocialActions"
          :show-management-actions="isOwnRecipesView"
          :is-favorites-loading="isFavoritesLoading"
          :is-authenticated="!!userDatas?.user?.email"
          :is-favorited="isRecipeFavorited[recipe.id]"
          @favorite-updated="(newState) => isRecipeFavorited[recipe.id] = newState"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
      />
    </template>
  </div>
</template>