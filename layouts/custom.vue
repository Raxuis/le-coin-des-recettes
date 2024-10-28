<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const links = [{
  label: 'À propos',
  to: '/about'
}, {
  label: 'Rechercher',
  to: '/search'
}]
</script>

<template>
  <div class="container mx-auto font-playfair max-sm:px-4 mb-10">
    <nav class="flex justify-between items-center my-4">
      <a href="/" class="flex gap-2 items-center">
        <NuxtImg src="/icon.png" class="size-10" />
        <p class="text-2xl text-masala-900 hover:text-persian-red-800 dark:text-white transition-colors">Le Coin des Recettes</p>
      </a>
      <ul class="flex gap-2 items-center">
        <li v-for="link in links" :key="link.label" class="list-none text-masala-900 hover:text-persian-red-800 dark:text-white dark:hover:text-persian-red-400 transition-colors">
          <NuxtLink :to=link.to>
            {{ link.label }}
          </NuxtLink>
        </li>
        <li>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
            class="hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
            />
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
