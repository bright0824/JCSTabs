<!-- eslint-disable vue/no-mutating-props -->
<template>
  <VCard
    width="200px"
    :loading="loading.update || loading.delete"
    :disabled="loading.update"
  >
    <VAlert v-if="error != null">
      {{ error }}
    </VAlert>
    <VCardTitle>
      {{ input.name }}
    </VCardTitle>
    <VCardText class="pb-0">
      <VForm>
        <VTextField
          label="Price"
          variant="outlined"
          type="number"
          v-model="input.price"
          prefix="$"
          :rules="rules.price"
          @keyup.enter="updateItem()"
        />
      </VForm>
    </VCardText>
    <VCardActions>
      <VBtn @click="updateItem()" color="green" :loading="loading.update">
        Update
      </VBtn>
      <DeleteItem :item="input" />
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { functions } from "@/firebase";
import type { Item } from "@/types";
import { httpsCallable } from "firebase/functions";
import { ref } from "vue";

// components
import DeleteItem from "./DeleteItem.vue";

// props
const props = defineProps<{
  input: Item;
  items: Item[];
}>();

// data
const loading = ref({
  update: false,
  delete: false,
  dialog: false,
});

const error = ref(null as string | null);
const rules = {
  price: [(v: number) => !!v || "Price is required"],
};

// methods
const updateItem = async () => {
  loading.value.update = true;
  try {
    await httpsCallable(
      functions,
      "updateItem"
    )({
      items: props.items,
    });
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value.update = false;
  }
};
</script>
