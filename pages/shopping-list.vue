<script lang="ts" setup>
interface ShoppingListProps {
  id: string;
  title: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

interface QueryProps {
  id: string;
  email: string;
  name: string;
  shoppingLists: ShoppingListProps[];
}

const {data: authDatas} = useAuth();
const {data, status, error} = await useFetch<QueryProps>('/api/shopping-list', {
  query: {email: authDatas.value?.user?.email}
});
</script>

<template>
  <div>
    <p v-if="status === 'error'">{{ error }}</p>
    <div class="flex justify-center mt-20" v-if="status === 'success'">
      <div v-if="!authDatas" class="flex flex-col items-center justify-center space-y-4">
        <p>Vous n'êtes pas connecté, veuillez vous connecter pour accéder à votre profil.</p>
        <UButton
            href="/auth/signIn"
            color="white"
            label="Se connecter"
            trailing-icon="material-symbols:login"
        />
      </div>

      <div v-else class="w-full flex flex-col items-center justify-center space-y-4">
        <p v-if="!data || data.shoppingLists.length === 0">
          Vous n'avez pas encore de liste, faites-en une !
        </p>

        <div v-else class="grid grid-cols-3 gap-4">
          <UCard
              v-for="shoppingList in data.shoppingLists"
              :key="shoppingList.id"
              class="w-full max-w-md"
          >
            {{ shoppingList.title }}
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
