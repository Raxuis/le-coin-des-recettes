<script lang="ts" setup>
const { data: authDatas, signOut } = useAuth();
console.log(authDatas.value.user)

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
    <p v-if="status === 'success'">{{ data.email }}</p>
  </div>
</template>
