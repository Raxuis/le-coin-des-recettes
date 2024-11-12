<script lang="ts" setup>
const { data: authDatas, signOut } = useAuth();

const email = authDatas.value?.user?.email;

let data, status, error;
if (email) {
  ({ data, status, error } = await useFetch('/api/profile', {
    query: { email }
  }));
}
</script>

<template>
  <div>
    <h1>Profile</h1>
    <p v-if="status === 'error'">{{ error }}</p>
    <div class="flex justify-center mt-20" v-if="status === 'success'">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="flex justify-center items-center">
          <img :src="data.image" alt="avatar" class="w-16 h-16 rounded-full">
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-bold">{{ data.name }}</h2>
            <p class="text-sm">{{ data.email }}</p>
          </div>
          <div class="flex flex-col gap-1" v-if="data.recipes">
            <h2 class="text-xl font-bold">Recipes</h2>
            <p class="text-sm">
              <NuxtLink to="/recipes">
                {{ data.recipes }}
              </NuxtLink>
            </p>
          </div>
          </div>
          </template>
      <template #footer>
        <div class="flex justify-center items-center">
          <UButton class="w-full block justify-center p-2" color="red" @click="signOut">
            Sign out
          </UButton>
        </div>
      </template>
    </UCard>
    </div>
  </div>
</template>
