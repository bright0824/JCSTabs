<template>
  <VDialog v-model="dialog" width="300px" @click:outside="close()">
    <template #activator="{ props }">
      <VBtn color="secondary" v-bind="props" class="ma-1" width="100%">
        Custom Item
      </VBtn>
    </template>
    <VAlert
      type="error"
      prominent
      class="text-center"
      elevation="2"
      v-if="error.code !== null"
    >
      <VAlertTitle>
        {{ error.code }}
      </VAlertTitle>
      {{ error.message }}
    </VAlert>
    <VCard :loading="loading" :disabled="loading">
      <VCardTitle>
        <span class="headline">New Item</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="itemInput" lazy-validation @submit.prevent>
          <VTextField
            label="Item Name"
            variant="outlined"
            v-model="input.name"
            :rules="rules.name"
            @keyup.enter="addItem"
          />
          <VTextField
            label="Item Price"
            variant="outlined"
            type="number"
            v-model="input.price"
            prefix="$"
            :rules="rules.price"
            @keyup.enter="addItem"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn color="green" @click="addItem"> Submit </VBtn>
        <VBtn color="red" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { ref } from "vue";
import { useFirebaseAuth, useFirestore } from "vuefire";

const emit = defineEmits(["close"]);

// firebase
const auth = useFirebaseAuth();
const db = useFirestore();

// data
const dialog = ref(false);
const loading = ref(false);
const rules = {
  name: [(v: string) => !!v || "Item name is required"],
  price: [
    (v: number) => !!v || "Item price is required",
    (v: number) => v > 0 || "Item price must be greater than 0",
    (v: any) => !isNaN(v) || "Item price must be a number",
  ],
};
const error = ref({
  code: null as string | null,
  message: null as string | null,
});

const input = ref({
  name: null as string | null,
  price: null as number | string | null,
});

const itemInput = ref(null);

// methods
const addItem = async () => {
  // @ts-expect-error
  const inputValidation = await itemInput.value.validate();
  if (inputValidation.valid === false) return;
  loading.value = true;
  if (!auth?.currentUser) return;
  try {
    await updateDoc(doc(db, "users", auth.currentUser?.uid), {
      tab: arrayUnion({
        name: input.value.name,
        price: parseInt(input.value.price as string),
        date: Timestamp.now(),
        paid: false,
      }),
    });
    close();
    emit("close");
  } catch (err) {
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value.name = null;
  input.value.price = null;
  error.value.code = null;
  error.value.message = null;
  dialog.value = false;
};
</script>
