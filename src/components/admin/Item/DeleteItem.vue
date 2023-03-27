<script setup lang="ts">
import { functions } from "@/firebase";
import type { Item } from "@/types";
import { httpsCallable } from "firebase/functions";
import { useToast } from "vue-toastification";

// props
const props = defineProps<{
  item: Item;
}>();

// composables
const toast = useToast();

// data
const loading = ref({
  pending: false,
  confirm: false,
});
const dialog = ref(false);
const error = ref(null as string | null);

// methods
const deleteItem = async () => {
  try {
    loading.value.confirm = true;
    const deleteItem = httpsCallable(functions, "deleteItem");
    await deleteItem({ item: props.item });

    toast.success(`'${props.item.name}' deleted successfully`);

    dialog.value = false;
  } catch (err) {
    console.log(err);

    toast.error(`${err}`);
    error.value = err as string;
  } finally {
    loading.value = {
      pending: false,
      confirm: false,
    };
  }
};
</script>

<template>
  <VDialog v-model="dialog" max-width="350px" align="center">
    <template #activator>
      <VBtn
        color="red"
        :loading="loading.pending"
        @click="
          dialog = true;
          loading.pending = true;
        "
      >
        Delete
      </VBtn>
    </template>
    <VCard :loading="loading.confirm" :disabled="loading.confirm">
      <VAlert v-if="error != null">
        {{ error }}
      </VAlert>
      <VCardTitle> Are you sure? </VCardTitle>
      <VCardSubtitle> This will permanently delete this item. </VCardSubtitle>
      <VCardActions>
        <VBtn @click="deleteItem()" color="red" :loading="loading.confirm">
          Delete
        </VBtn>
        <VBtn
          @click="
            dialog = false;
            loading.pending = false;
          "
          color="green"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
