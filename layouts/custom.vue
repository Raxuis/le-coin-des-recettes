<script setup lang="ts">
const links = [{
  label: 'À propos',
  to: '/about'
}, {
  label: 'Rechercher',
  to: '/search'
}]
</script>

<template>
  <div class="container mx-auto font-playfair max-sm:px-4">
    <nav class="flex justify-between items-center my-4">
      <a href="/" class="flex gap-2 items-center">
        <NuxtImg src="/icon.png" class="size-10" />
        <p class="text-2xl text-masala-900 hover:text-persian-red-800">Le Coin des Recettes</p>
      </a>
      <ul class="flex gap-2">
        <li v-for="link in links" :key="link.label" class="list-none text-masala-900 hover:text-persian-red-800">
          <NuxtLink :to=link.to>
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
