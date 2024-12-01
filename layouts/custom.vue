<script lang="ts" setup>
import {ref, computed} from 'vue'

interface RoutesProps {
  label: string;
  to: string;
  protected?: boolean;
}


const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})


const routes: RoutesProps[] = [{
  label: 'À propos',
  to: '/about'
}, {
  label: 'Recettes',
  to: '/recipes'
}, {
  label: 'Recettes d\'événement',
  to: '/special-events-recipes'
}, {
  label: 'Communauté',
  to: '/community'
},
  {
    label: "Mes recettes",
    to: '/own-recipes',
    protected: true
  },
  {
    label: "Mes listes de courses",
    to: '/shopping-lists',
    protected: true
  }
]

const {data, signOut} = useAuth()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="container mx-auto font-playfair max-sm:px-4 mb-10">
    <nav class="flex max-sm:flex-col max-sm:space-y-4 justify-between sm:items-center my-4">
      <div class="flex justify-between items-center w-full">
        <a href="/" class="flex gap-2 items-center">
          <NuxtImg src="/icon.png" class="size-10"/>
          <p class="text-xl sm:text-2xl text-masala-900 hover:text-persian-red-800 dark:text-white transition-colors">Le
            Coin des Recettes</p>
        </a>
        <div class="flex gap-2 items-center">
          <div class="flex gap-2 items-center justify-center max-lg:w-full">
            <UButton
                :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                color="gray"
                variant="ghost"
                aria-label="Theme"
                @click="isDark = !isDark"
                class="hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
            />
            <div v-if="data" class="hidden sm:flex gap-2 items-center justify-center">
              <div>
                <NuxtLink to="/profile"
                          class="flex relative bg-gray-100 hover:bg-persian-red-400 text-persian-red-400 hover:text-white rounded-full transition-colors">
                  <UAvatar
                      :src="data.user?.image!"
                      :alt="data.user?.name!.charAt(0)"
                      onerror="this.onerror=null; this.remove();"
                      class="z-10"
                  />
                  <p class="z-5 absolute inset-0 flex justify-center items-center">{{ data.user?.name!.charAt(0) }}</p>
                </NuxtLink>
              </div>
              <UButton
                  icon="lucide:log-out"
                  size="sm"
                  color="white"
                  variant="solid"
                  label="Se déconnecter"
                  :trailing="false"
                  @click="() => signOut({ callbackUrl: '/' })"
              />
            </div>
            <UButton
                v-else
                icon="lucide:log-in"
                size="sm"
                color="white"
                variant="solid"
                label="Se connecter"
                :trailing="false"
                @click="router.push('/auth/signIn')"
                class="hidden sm:flex"
            />
          </div>
          <UButton
              icon="i-heroicons-bars-3"
              color="gray"
              variant="ghost"
              aria-label="Menu"
              @click="toggleMobileMenu"
              class="sm:ml-2"
          />
        </div>
      </div>
    </nav>
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform translate-x-full"
        enter-to-class="transform translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-x-0"
        leave-to-class="transform translate-x-full"
    >
      <BurgerMenu
          v-if="isMobileMenuOpen"
          :routes="routes"
          :user-data="data"
          @close="toggleMobileMenu"
          @sign-out="signOut"
          @sign-in="router.push('/auth/signIn')"
      />
    </Transition>
    <NuxtPage/>
  </div>
</template>