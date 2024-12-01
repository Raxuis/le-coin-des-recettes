<script lang="ts" setup>
import AddShoppingListModal from "~/components/AddShoppingListModal.vue";
import {closeModal} from "~/utils/modal";

interface ItemsProps {
  id: string;
  title: string;
  isChecked: boolean;
  number: number;
}

interface ShoppingListProps {
  id: string;
  title: string;
  items: ItemsProps[];
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

    if (response?.data?.value?.statusCode === 201) {
      toast.add({
        title: "Succès",
        description: "Liste créée avec succès !",
        color: "norway",
      });
      closeModal();
      if (data.value && response.data.value.statusMessage) {
        // previously response.data.value.data but issue with typescript
        data.value.shoppingLists.push(response.data.value.statusMessage as ShoppingListProps);
      }
    } else {
      throw new Error(response.error.value?.statusMessage || "Erreur inconnue");
    }
  } catch (err) {
    toast.add({
      title: "Erreur",
      description: "Impossible de créer la liste.",
      color: "red",
    });
    console.error(err);
  }
};

const updateItemQuantity = async (itemId: string, number: number) => {
  try {
    const response = await useFetch(`/api/shopping-list/update-item-quantity/${itemId}`, {
      method: 'PATCH',
      body: {
        email: authDatas.value?.user?.email,
        number: number,
      }
    });

    if (response.data?.value?.statusCode === 200) {
      if (data.value) {
        data.value.shoppingLists = data.value.shoppingLists.map(list => ({
          ...list,
          items: list.items.map(item =>
              item.id === itemId
                  ? { ...item, number }
                  : item
          )
        }));
      }
    }
  } catch (err) {
    console.error(err);
    toast.add({
      title: "Erreur",
      description: "Impossible de mettre à jour la quantité.",
      color: "red",
    });
  }
};

const updateItemCheck = async (itemId: string, isChecked: boolean) => {
  try {
    const response = await useFetch(`/api/shopping-list/update-item/${itemId}`, {
      method: 'PATCH',
      body: {
        email: authDatas.value?.user?.email,
        isChecked: !isChecked,
      }
    });
    if (response.data?.value?.statusCode === 200) {
      // Searching the checkbox in the DOM
      if (data.value) {
        data.value.shoppingLists = data.value.shoppingLists.map(list => ({
          ...list,
          items: list.items.map(item =>
              item.id === itemId
                  ? {...item, isChecked: !isChecked}
                  : item
          )
        }));
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const deleteItem = async (itemId: string, shoppingListId: string) => {
  try {
    const response = await useFetch(`/api/shopping-list/delete-item/${itemId}`, {
      method: 'DELETE',
      body: {
        email: authDatas.value?.user?.email,
      }
    });

    if (response.data?.value?.statusCode === 200) {
      if (data.value) {
        data.value.shoppingLists = data.value.shoppingLists.map(list => {
          if (list.id === shoppingListId) {
            return {
              ...list,
              items: list.items.filter(item => item.id !== itemId)
            };
          }
          return list;
        });
      }
    }
  } catch (err) {
    console.error(err);
    toast.add({
      title: "Erreur",
      description: "Impossible de supprimer l'article.",
      color: "red",
    });
  }
};

const deleteShoppingListFromId = async (id: string) => {
  try {
    const response = await useFetch(`/api/shopping-list/delete/${id}`, {
      method: 'DELETE',
      body: {
        email: authDatas.value?.user?.email,
      }
    });

    if (response.data?.value?.statusCode === 200) {
      toast.add({
        title: "Succès",
        description: "Liste supprimée avec succès !",
        color: "norway",
      });
      if (data.value) {
        data.value.shoppingLists = data.value.shoppingLists.filter(
            list => list.id !== id
        );
      }
    } else {
      throw new Error(response.error.value?.statusMessage || "Erreur inconnue");
    }
  } catch (err) {
    toast.add({
      title: "Erreur",
      description: "Impossible de supprimer la liste.",
      color: "red",
    });
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
          <p class="text-center">
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
            <p class="text-center">Doucement, que 6 listes de courses... 🛒</p>
            <p class="text-sm text-gray-500 text-center">Supprimez en pour pouvoir en faire d'autres.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 w-full">
            <div
                v-for="shoppingList in data.shoppingLists"
                :key="shoppingList.id"
                class="relative w-full col-span-1 flex flex-col bg-ronchi-500 rounded-md shadow-md p-6 group"
            >
              <UIcon name="ic:baseline-delete"
                     class="absolute top-5 right-5 size-5 text-white group-hover:text-persian-red-500 duration-300 cursor-pointer"
                     @click="deleteShoppingListFromId(shoppingList.id)"
              />
              {{ shoppingList.title }}
              <hr/>
              <ul class="flex flex-col">
                <li v-for="item in shoppingList.items"
                    :key="item.id"
                    class="flex items-center justify-between group/item pt-4">
                  <div class="flex items-center flex-1">
                    <UCheckbox
                        :label="item.title"
                        :model-value="item.isChecked"
                        color="sky"
                        @click="updateItemCheck(item.id, item.isChecked)"
                    />
                    <span class="ml-2 text-sm text-gray-600">({{ item.number }})</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <UButton
                        size="xs"
                        color="white"
                        :icon="'i-heroicons-minus'"
                        :disabled="item.number <= 1"
                        @click="updateItemQuantity(item.id, item.number - 1)"
                    />
                    <UButton
                        size="xs"
                        color="white"
                        :icon="'i-heroicons-plus'"
                        @click="updateItemQuantity(item.id, item.number + 1)"
                    />
                    <UButton
                        size="xs"
                        color="red"
                        :icon="'i-heroicons-trash'"
                        @click="deleteItem(item.id, shoppingList.id)"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
