<script setup lang="ts">
import type { TabItem } from "@/types";
import { mdiDelete } from "@mdi/js";
import { useToast } from "vue-toastification";

// composables
const auth = useFirebaseAuth();
const db = useFirestore();
const toast = useToast();

// props
const props = defineProps<{
  item: TabItem;
}>();

// data
const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null as string | null,
  message: null as string | null,
});

// methods
const deleteItem = async () => {
  loading.value = true;
  try {
    const user = auth?.currentUser;
    if (!user) {
      throw new Error("User not logged in");
    }

    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      tab: arrayRemove(props.item),
    });

    toast.success(`${props.item.name} deleted from tab`);
    dialog.value = false;
  } catch (err) {
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  dialog.value = false;
  loading.value = false;
  error.value = {
    code: null,
    message: null,
  };
};
</script>

<template>
  <VDialog v-model="dialog" max-width="400px" align="center">
    <template #activator="{ props }">
      <VBtn v-bind="props" color="red" @click="dialog = true" icon>
        <VIcon :icon="mdiDelete" />
      </VBtn>
    </template>
    <VCard :loading="loading" :disabled="loading">
      <VAlert
        v-if="error.code !== null"
        type="error"
        variant="outlined"
        prominent
        class="text-center"
        elevation="2"
      >
        <VAlertTitle>
          {{ error.code }}
        </VAlertTitle>
        {{ error.message }}
      </VAlert>
      <VCardTitle class="text-center">
        <span>Delete Item</span>
      </VCardTitle>
      <VCardSubtitle>
        {{ item?.name }} at
        {{ item?.date.toDate().toLocaleString() }}
      </VCardSubtitle>
      <VCardText>
        <span> Are you sure you want to delete this item? </span>
      </VCardText>
      <VCardActions>
        <VBtn
          color="success"
          @click="deleteItem"
          :loading="loading"
          :disabled="loading"
        >
          Confirm
        </VBtn>
        <VBtn color="error" @click="cancel()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
