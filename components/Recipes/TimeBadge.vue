<script setup lang="ts">
interface Props {
  color: string;
  icon: string;
  time: number;
  tooltip: string;
}

defineProps<Props>();
</script>

<template>
  <UTooltip :text="tooltip" :popper="{ placement: 'top' }">
    <UBadge :color="color" variant="subtle" class="inline-flex gap-2">
      <UIcon :name="icon" class="size-5"/>
      {{ time }}min
    </UBadge>
  </UTooltip>
</template>