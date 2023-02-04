<template>
  <VDialog v-model="dialog" max-width="500px">
    <template #activator="{ props }">
      <VBtn
        v-bind="props"
        variant="text"
        color="auto"
        @click="dialog = true"
        block
        class="justify-start"
      >
        <MdiMessageAlertOutline class="mr-2" />
        Send feedback
      </VBtn>
    </template>
    <VCard :loading="loading">
      <VAlert
        v-if="error.code"
        type="error"
        dismissible
        transition="scale-transition"
        elevation="2"
        color="red"
      >
        <VAlertTitle>
          {{ error.code }}
        </VAlertTitle>
        {{ error.message }}
      </VAlert>
      <VCardTitle class="headline">Feedback Submission</VCardTitle>
      <VCardText>
        <VForm ref="inputForm">
          <VTextarea
            v-model="input"
            label="Feedback"
            placeholder="Enter your feedback here..."
            outlined
            rows="5"
            :rules="rules.text"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="success" text @click="submit">Submit</VBtn>
        <VBtn color="error" text @click="dialog = false">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

const dialog = ref(false);
const input = ref("");
const inputForm = ref(null);
const loading = ref(false);
const error = ref({
  code: null,
  message: null,
} as { code: string | null; message: string | null });

const rules = {
  text: [(v: string) => !!v || "Field cannot be empty"],
};

const submit = async () => {
  // @ts-expect-error
  const { valid } = await inputForm.value.validate();

  if (!valid) return;

  loading.value = true;

  const { useFirebaseAuth, useFirestore } = await import("vuefire");
  const { addDoc, collection, Timestamp } = await import("firebase/firestore");

  try {
    const auth = useFirebaseAuth()!;
    const db = useFirestore()!;

    await addDoc(collection(db, "feedback"), {
      name: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      date: Timestamp.now(),
      text: input.value,
    });

    close();
  } catch (err) {
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };

    console.log(error);
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value = "";

  error.value = {
    code: null,
    message: null,
  };

  dialog.value = false;
};
</script>
