<script setup lang="ts">
import { functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";
import { useToast } from "vue-toastification";

// composables
const toast = useToast();

// props
const props = defineProps<{
  email: string;
  name: string;
}>();

// data
const dialog = ref(false);
const loading = ref(false);
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

console.log("Email", props.email);

// methods
const clearTab = async () => {
  loading.value = true;
  try {
    const clearTab = httpsCallable(functions, "clearTab");
    await clearTab({ email: props.email });
    dialog.value = false;

    toast.success(`Your tab has been cleared.`);

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

<template>
  <VDialog v-model="dialog" max-width="500px" @click:outside="closeDialog()">
    <template #activator="{ props }">
      <VBtn v-bind="props" color="red"> Clear Tab </VBtn>
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
      <VCardText> Are you sure you want to clear {{ name }} tab? </VCardText>
      <VCardActions>
        <VBtn color="green" @click="clearTab()"> Confirm </VBtn>
        <VBtn color="red" @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
