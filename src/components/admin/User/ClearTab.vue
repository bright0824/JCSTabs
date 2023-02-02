<template>
  <VDialog v-model="dialog" max-width="500px" @click:outside="closeDialog()">
    <template #activator="{ props }">
      <VBtn v-bind="props" color="red" :loading="dialog"> Clear Tab </VBtn>
    </template>
    <VCard :disabled="loading" :loading="loading">
      <VAlert type="error" v-if="error.code != null">
        <VAlertTitle>
          {{ error.code }}
        </VAlertTitle>
        {{ error.message }}
      </VAlert>
      <VCardTitle>Are you sure?</VCardTitle>
      <VCardSubtitle>this action cannot be undone.</VCardSubtitle>
      <VCardText>
        Are you sure you want to clear the tab for
        <strong>{{ user?.info?.displayName }}</strong
        >?
      </VCardText>
      <VCardActions>
        <VBtn
          color="green"
          @click="clearTab()"
          :disabled="loading"
          :loading="loading"
        >
          Confirm
        </VBtn>
        <VBtn color="red" @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { functions } from "@/firebase";
import type { User } from "@/types";
import { httpsCallable } from "firebase/functions";
import { ref } from "vue";

// inject the user
const { user } = defineProps<{ user: User | null }>();

const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const clearTab = async () => {
  loading.value = true;
  try {
    const clearTab = httpsCallable(functions, "clearTab");
    await clearTab({ email: user?.info.email });
    dialog.value = false;

    error.value = { code: null, message: null };
  } catch (err) {
    console.log(err);
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  dialog.value = false;
  error.value = { code: null, message: null };
};
</script>
