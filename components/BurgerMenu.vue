<script setup lang="ts">
defineProps<{
  routes: Array<{
    label: string
    to: string
    protected?: boolean
  }>,
  userData: any
}>()

const emit = defineEmits(['close', 'sign-out', 'sign-in'])
</script>

<template>
  <div class="w-screen fixed top-0 right-0 h-full bg-white dark:bg-gray-900 z-50 text-start sm:text-end">
    <div class="mx-auto container py-4 max-sm:px-4">
      <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          aria-label="Close menu"
          @click="emit('close')"
          class="mb-4"
      />
      <ul class="space-y-4 whitespace-nowrap">
        <li
            v-for="route in routes.filter((item) => !item.protected)"
            :key="route.label"
            class="text-lg text-masala-900 dark:text-white hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
        >
          <NuxtLink
              :to="route.to"
              @click="emit('close')"
          >
            {{ route.label }}
          </NuxtLink>
        </li>
        <li class="sm:hidden pt-4 border-t">
          <div v-if="userData" class="space-y-4">
            <NuxtLink
                to="/profile"
                @click="emit('close')"
                class="flex items-center justify-start sm:justify-end gap-2 text-lg text-masala-900 dark:text-white hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
            >
              <span>Profil</span>
              <UAvatar
                  :src="userData.user?.image!"
                  :alt="userData.user?.name!.charAt(0)"
                  size="sm"
              />
            </NuxtLink>
            <UButton
                icon="lucide:log-out"
                size="sm"
                color="white"
                variant="solid"
                label="Se déconnecter"
                :trailing="false"
                @click="() => {
                emit('sign-out', { callbackUrl: '/' })
                emit('close')
              }"
                class="w-full flex justify-center"
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
              @click="() => {
              emit('sign-in')
              emit('close')
            }"
              class="w-full flex justify-center"
          />
        </li>
        <li class="sm:hidden border-t"></li>
        <li
            v-for="route in routes.filter((item) => item.protected)"
            :key="route.label"
        >
          <NuxtLink
              :to="route.to"
              @click="emit('close')"
              class="flex items-center justify-start sm:justify-end gap-2 text-lg text-masala-900 dark:text-white hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
          >
            {{ route.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>