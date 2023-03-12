<script setup lang="ts">
import MdiMessageAlertOutline from "~icons/mdi/message-alert-outline";

// scaffolding
const route = useRoute();
const auth = useFirebaseAuth();
const db = useFirestore();

// data
const data = () => {
  return {
    dialog: ref(false),
    input: ref(""),
    inputForm: ref(null),
    loading: ref(false),
    error: ref({
      code: null,
      message: null,
    } as { code: string | null; message: string | null }),
    rules: {
      text: [(v: string) => !!v || "Field cannot be empty"],
    },
  };
};
const { dialog, input, inputForm, loading, error, rules } = data();

const submit = async () => {
  // @ts-expect-error
  const { valid } = await inputForm.value.validate();

  if (!valid) return;

  loading.value = true;

  try {
    await addDoc(collection(db, "feedback"), {
      _meta: {
        createdBy: auth?.currentUser?.uid,
        createdAt: Timestamp.now(),
      },
      device: {
        userAgent: navigator.userAgent,
        currentPath: route.fullPath,
      },
      name: auth?.currentUser?.displayName,
      email: auth?.currentUser?.email,
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

/**
 * Closes the dialog
 */
const close = () => {
  input.value = "";

  error.value = {
    code: null,
    message: null,
  };

  dialog.value = false;
};
</script>

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
        :prepend-icon="MdiMessageAlertOutline"
      >
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
            placeholder="Have a suggestion? Found a bug? Let us know!"
            rows="5"
            :rules="rules.text"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="success" text @click="submit">Submit</VBtn>
        <VBtn color="error" text @click="close">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
