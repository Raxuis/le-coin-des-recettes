<script lang="ts" setup>

const { formState, onSubmit } = defineProps<{
  formState: { title: string; items: string[] };
  onSubmit: (data: { title: string; items: string[] }) => void;
}>();

const toast = useToast();

const handleSubmit = () => {
  if (!formState.title.trim()) {
    toast.add({
      title: "Erreur",
      description: "Le titre ne peut pas être vide.",
      color: "red",
    });
    return;
  }
  onSubmit({ ...formState });
};
</script>

<template>
  <UModal>
    <div class="p-6">
      <UForm @submit.prevent="handleSubmit" class="space-y-4">
        <UFormGroup label="Titre de la liste" name="title">
          <UInput v-model="formState.title" placeholder="Nom de la liste" name="title" required />
        </UFormGroup>

        <UFormGroup label="Articles (séparés par des virgules)" name="items">
          <UInput
              v-model="formState.items"
              placeholder="Ex: Pommes, Pain, Lait"
              name="items"
              @blur="formState.items = formState.items.split(',').map(item => item.trim())"
          />
        </UFormGroup>

        <UButton type="submit" color="primary" class="w-full block">
          Ajouter la liste
        </UButton>
      </UForm>
    </div>
  </UModal>
</template>
