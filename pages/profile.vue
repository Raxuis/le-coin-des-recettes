<script lang="ts" setup>
import {useRouter} from "vue-router";

const router = useRouter();
const {data: authDatas, signOut} = useAuth();

const {data, status, error} = await useFetch('/api/profile', {
  query: {email: authDatas.value?.user?.email}
});

const handleSignOut = async () => {
  await signOut();
};
</script>

<template>
  <div>
    <p v-if="status === 'error'">{{ error }}</p>
    <div class="flex justify-center mt-20" v-if="status === 'success'">
      <div class="flex flex-col items-center justify-center space-y-4" v-if="!data">
        <p>Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre profil.</p>
        <UButton href="/auth/signIn" color="white" label="Se connecter" trailing-icon="material-symbols:login"/>
      </div>
      <UCard class="w-full max-w-md" v-else>
        <template #header>
          <div
              class="flex relative bg-gray-100 hover:bg-persian-red-400 text-persian-red-400 hover:text-white rounded-full transition-colors w-16 h-16 cursor-default m-auto">
            <img
                :src="data.image!"
                :alt="data.name.charAt(0)"
                onerror="this.onerror=null; this.remove();"
                class="z-10 size-full rounded-full"
            />
            <p class="z-5 absolute inset-0 flex justify-center items-center">{{ data.name.charAt(0) }}</p>
          </div>
        </template>
        <template #default>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <h2 class="text-xl font-bold">{{ data.name }}</h2>
              <p class="text-sm">{{ data.email }}</p>
            </div>
            <div class="flex flex-col gap-1" v-if="data.recipes">
              <h2 class="text-xl font-bold">Recettes</h2>
              <ul>
                <li v-for="recipe in data.recipes" :key="recipe.slug">
                  <NuxtLink :to="`/recipe/${recipe.slug}`">
                    - {{ recipe.title }}
                  </NuxtLink>
                </li>
              </ul>
              <div class="flex flex-col gap-1" v-if="data.favoriteRecipes.length">
                <h2 class="text-xl font-bold">Favoris</h2>
                <ul>
                  <li v-for="favoriteRecipe in data.favoriteRecipes" :key="favoriteRecipe.slug">
                    <NuxtLink :to="`/recipe/${favoriteRecipe.slug}`">
                      - {{ favoriteRecipe.title }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
              <p class="text-sm text-gray-500">
                Ce ne sont que vos 5 dernières recettes crées<span v-if="data.favoriteRecipes.length">et favorites</span>.
              </p>
              <div class="grid grid-cols-2 space-x-4 mt-2">
                <UButton size="sm" color="serenade" class="col-span-1 block" @click="router.push('/own-recipes')">
                  Mes recettes
                </UButton>
                <UButton size="sm" color="norway" class="col-span-1 block" @click="router.push('/shopping-list')">
                  Mes listes de courses
                </UButton>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-center items-center">
            <UButton class="w-full block justify-center p-2" color="red" @click="handleSignOut">
              Se déconnecter
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
