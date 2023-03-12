<script setup lang="ts">
import { functions } from "@/firebase";
import { httpsCallable } from "firebase/functions";

// data
const dialog = ref(false);
const loading = ref(false);
const error = ref(null as string | null);
const rules = {
  name: [(v: string) => !!v || "Item name is required"],
  price: [
    (v: number) => !!v || "Item price is required",
    (v: number) => v > 0 || "Item price must be greater than 0",
    (v: any) => !isNaN(v) || "Item price must be a number",
  ],
};

const input = ref({
  name: null as string | null,
  price: null as number | null,
});

const itemInput = ref(null);

// methods
const addItem = async () => {
  // @ts-expect-error
  const inputValidation = await itemInput.value?.validate();
  if (inputValidation.valid === false) return;
  loading.value = true;
  try {
    const addItem = httpsCallable(functions, "addItem");
    await addItem({ item: input.value });
    close();
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value = false;
  }
};

const close = () => {
  input.value.name = "";
  input.value.price = null;
  dialog.value = false;
};
</script>

<template>
  <VBtn color="secondary" @click="dialog = true"> New Item </VBtn>
  <VDialog v-model="dialog" width="300px" @click:outside="close()">
    <VCard :loading="loading" :disabled="loading">
      <VAlert v-if="error" type="error">
        <VAlertTitle>Error Occurred</VAlertTitle>
        {{ error }}
      </VAlert>
      <VCardTitle>
        <span class="headline">New Item</span>
      </VCardTitle>
      <VCardText>
        <VForm ref="itemInput" lazy-validation>
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
        <VBtn color="green" @click="addItem" :loading="loading"> Submit </VBtn>
        <VBtn color="red" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
