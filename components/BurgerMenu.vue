<script setup lang="ts">
defineProps<{
  routes: Array<{
    label: string
    to: string
  }>,
  userData: any
}>()

const emit = defineEmits(['close', 'sign-out', 'sign-in'])
</script>

<template>
  <div class="fixed inset-0 bg-white dark:bg-gray-900 z-50">
    <div class="p-4">
      <UButton
          icon="i-heroicons-x-mark"
          color="gray"
          variant="ghost"
          aria-label="Close menu"
          @click="emit('close')"
          class="mb-4"
      />
      <ul class="space-y-4">
        <li
            v-for="route in routes"
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
        <!-- Add authentication items only visible on mobile -->
        <li class="sm:hidden pt-4 border-t">
          <div v-if="userData" class="space-y-4">
            <NuxtLink
                to="/profile"
                @click="emit('close')"
                class="flex items-center gap-2 text-lg text-masala-900 dark:text-white hover:text-persian-red-800 dark:hover:text-persian-red-400 transition-colors"
            >
              <UAvatar
                  :src="userData.user?.image!"
                  :alt="userData.user?.name!.charAt(0)"
                  size="sm"
              />
              <span>Profil</span>
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
                class="w-full"
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
              class="w-full"
          />
        </li>
      </ul>
    </div>
  </div>
</template>