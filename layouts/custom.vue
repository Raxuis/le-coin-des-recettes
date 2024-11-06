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
  label: 'Recettes',
  to: '/recipes'
}, {
  label: 'Recettes d’événement',
  to: '/event-recipes'
}]

const { data, signOut } = useAuth()
const router = useRouter()

</script>

<template>
  <div class="container mx-auto font-playfair max-sm:px-4 mb-10">
    <nav class="flex max-sm:flex-col max-sm:space-y-4 justify-between sm:items-center my-4">
      <a href="/" class="flex gap-2 items-center">
        <NuxtImg src="/icon.png" class="size-10" />
        <p class="text-xl sm:text-2xl text-masala-900 hover:text-persian-red-800 dark:text-white transition-colors">Le Coin des Recettes</p>
      </a>
      <ul class="flex gap-2 items-center justify-between">
        <div class="flex items-center divide-x divide-white">
        <li v-for="link in links" :key="link.label" class="list-none text-masala-900 hover:text-persian-red-800 dark:text-white dark:hover:text-persian-red-400 transition-colors px-2">
          <NuxtLink :to=link.to>
            {{ link.label }}
          </NuxtLink>
        </li>
      </div>
      <div class="flex gap-2 items-center">
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
        <li v-if="data">
          <UAvatar
          :src="data.user?.image!"
          :alt="data.user?.name!"
          />
        </li>
        <li v-if="data">
        <UButton
          icon="lucide:log-out"
          size="sm"
          color="white"
          variant="solid"
          label="Se déconnecter"
          :trailing="false"
          @click="() => signOut({ callbackUrl: '/' })"
          />
        </li>
        <li v-else>
          <UButton
          icon="lucide:log-in"
          size="sm"
          color="white"
          variant="solid"
          label="Se connecter"
          :trailing="false"
          @click="router.push('/auth/signIn')"
          />
        </li>
      </div>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
