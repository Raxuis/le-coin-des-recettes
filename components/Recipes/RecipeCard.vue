<script setup lang="ts">
import type {RecipesProps} from '~/utils/types';
import {useRecipeFavorites} from '~/composables/useRecipeFavorites';
import {firstCharacterToUppercase} from '#imports';
import TimeBadge from "~/components/Recipes/TimeBadge.vue";
import {calculateAverageRating} from '~/utils/calculateAverageRating';

interface Props {
  recipe: RecipesProps | OwnRecipesDatas;
  showSocialActions: boolean;
  showManagementActions: boolean;
  isFavorited: boolean;
  isFavoritesLoading: boolean;
  isAuthenticated: boolean;
}

defineProps<Props>();

const emit = defineEmits(['edit', 'delete', 'favoriteUpdated']);

const {toggleFavorite} = useRecipeFavorites();

const handleFavoriteClick = async (recipeId: string) => {
  const result = await toggleFavorite(recipeId);
  if (result !== undefined) {
    emit('favoriteUpdated', result);
  }
};
</script>

<template>
  <UCard class="relative group">
    <template #header>
      <div v-if="showSocialActions"
           class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
        <UIcon
            :name="isFavorited ? 'material-symbols:kid-star' : 'material-symbols:kid-star-outline'"
            class="size-5 text-yellow-500"
            @click="handleFavoriteClick(recipe.id)"
            v-if="!isFavoritesLoading && isAuthenticated"
        />
        <UIcon
            name="material-symbols-light:content-copy"
            class="size-5 text-persian-red-300"
            @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'copyToClipboard' })"
        />
        <UIcon
            name="material-symbols-light:share"
            class="size-5 text-blue-300"
            @click="shareRecipe({ slug: recipe.slug ?? '', title: recipe.title, action: 'shareToSocial' })"
        />
      </div>

      <div v-if="showManagementActions"
           class="absolute top-4 right-4 flex gap-1 items-center justify-center text-sm cursor-pointer">
        <UIcon
            name="material-symbols:edit-outline"
            class="size-5 text-blue-500"
            @click="emit('edit', recipe)"
        />
        <UIcon
            name="ic:baseline-delete"
            class="size-5 text-persian-red-500"
            @click="emit('delete', recipe.id)"
        />
      </div>

      <div class="flex flex-col items-center justify-center space-y-2 pt-4">
        <div class="flex flex-col items-center justify-center">
          <NuxtLink class="text-center text-lg underline underline-offset-2" :to="`/recipe/${recipe.slug}`">
            {{ recipe.title }}
          </NuxtLink>
          <div class="flex gap-4">
            <p class="text-sm flex items-center gap-1 text-gray-500/50">
              <UIcon
                  name="gravity-ui:comments"
                  size="sm"
              />
              {{ recipe.comments || 0 }}
            </p>
            <p class="text-sm flex items-center gap-1 text-yellow-500/50">
              <UIcon
                  name="gravity-ui:star"
                  size="sm"
              />
              {{
                recipe.ratingValues && Array.isArray(recipe.ratingValues) ? calculateAverageRating(recipe.ratingValues) : "Pas de notes"
              }}
            </p>
          </div>
          <p class="text-sm text-gray-500">
            {{ firstCharacterToUppercase(recipe.type.toLowerCase()) }}
          </p>
        </div>

        <div class="flex justify-center w-full gap-4 cursor-default">
          <TimeBadge
              color="norway"
              icon="material-symbols:concierge-rounded"
              :time="recipe.preparationTime"
              tooltip="Temps de préparation"
          />
          <TimeBadge
              color="serenade"
              icon="ph:cooking-pot-fill"
              :time="recipe.cookingTime"
              tooltip="Temps de cuisson"
          />
          <TimeBadge
              color="mercury"
              icon="material-symbols:alarm"
              :time="recipe.restingTime"
              tooltip="Temps de repos"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between px-2">
        <UTooltip text="Difficulté" :popper="{ placement: 'top' }">
          <UButton color="gray" class="text-serenade-500">
            <UIcon name="mdi:chef-hat" class="size-5"/>
            {{ firstCharacterToUppercase(recipe.difficulty) }}
          </UButton>
        </UTooltip>
        <UTooltip text="Budget" :popper="{ placement: 'top' }">
          <UButton color="gray" class="text-norway-500">
            <UIcon name="material-symbols:money-bag-rounded" class="size-5"/>
            {{ firstCharacterToUppercase(recipe.budget) }}
          </UButton>
        </UTooltip>
      </div>
    </template>
  </UCard>
</template>