<script lang="ts" setup>
import AddShoppingListModal from "~/components/AddShoppingListModal.vue";
import {closeModal} from "~/utils/modal";

interface ShoppingListProps {
  id: string;
  title: string;
  items: Array<{
    id: string;
    title: string;
    isChecked: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface QueryProps {
  id: string;
  email: string;
  name: string;
  shoppingLists: ShoppingListProps[];
}

const modal = useModal();
const toast = useToast();
const {data: authDatas} = useAuth();


const state = reactive({
  title: '',
  items: [],
});

const {data, status, error} = await useFetch<QueryProps>('/api/shopping-list/read', {
  query: {email: authDatas.value?.user?.email}
});

const createShoppingList = () => {
  modal.open(AddShoppingListModal, {
    formState: state,
    onSubmit: newShoppingList,
  });
};


const newShoppingList = async (formData: { title: string; items: string[] }) => {
  try {
    const response = await useFetch('/api/shopping-list/create', {
      method: 'POST',
      body: {
        email: authDatas.value?.user?.email,
        title: formData.title,
        items: formData.items,
      },
    });

    if (response?.data?.value.statusCode === 201) {
      toast.add({
        title: "Succès",
        description: "Liste créée avec succès !",
        color: "norway",
      });
      closeModal();
      if (data.value && response.data.value.data) {
        data.value.shoppingLists.push(response.data.value.data);
      }
    } else {
      throw new Error(response.error.value?.statusMessage || "Erreur inconnue");
    }
  } catch (err) {
    toast.add({
      title: "Erreur",
      description: err || "Impossible de créer la liste.",
      color: "red",
    });
    console.error(err);
  }
};

const updateItemCheck = async (itemId: string, isChecked: boolean) => {
  try {
    await useFetch(`/api/shopping-list/update-item/${itemId}`, {
      method: 'PATCH',
      body: {
        isChecked
      }
    });
  } catch (err) {
    console.error(err);
  }
};

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
          Vous n'avez pas encore de liste, pourquoi pas en faire une ! 📋
        </p>
        <UButton
            v-if="data && data.shoppingLists.length === 0"
            @click="createShoppingList"
            color="primary"
            label="Créer une nouvelle liste"
            leading-icon="material-symbols:add"
        />
        <div v-if="data && data.shoppingLists.length > 0"
             class="w-full flex flex-col items-center justify-center space-y-4">
          <p>
            Vous pouvez toujours en créer d'autres ! 📋
          </p>
          <UButton
              v-if="data.shoppingLists.length < 6"
              @click="createShoppingList"
              color="primary"
              label="Créer une nouvelle liste"
              leading-icon="material-symbols:add"
          />
          <div v-else class="w-full flex flex-col items-center justify-center">
            <p>Doucement, que 6 listes de courses... 🛒</p>
            <p class="text-sm text-gray-500">Supprimez en pour pouvoir en faire d'autres.</p>
          </div>
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div
                v-for="shoppingList in data.shoppingLists"
                :key="shoppingList.id"
                class="w-full col-span-1 flex flex-col bg-ronchi-500 rounded-md shadow-md p-6 min-w-80 min-h-40"
            >
              {{ shoppingList.title }}
              <hr/>
              <ul class="flex flex-col">
                <li v-for="item in shoppingList.items">
                  <UCheckbox :label="item.title" :model-value="item.isChecked" color="ronchi" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
