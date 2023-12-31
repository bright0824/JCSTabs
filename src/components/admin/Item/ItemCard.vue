<script setup lang="ts">
import { functions } from "@/firebase";
import type { Item } from "@/types";
import { httpsCallable } from "firebase/functions";

// components
import DeleteItem from "./DeleteItem.vue";
import type { VCard } from "vuetify/lib/components/index.mjs";

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

const price = ref(props.input.price);

const error = ref(null as string | null);
const rules = {
  price: [
    (v: number) => !!v || "Price is required",
    (v: number) => v > 0 || "Price must be greater than 0",
    (v: any) => !isNaN(v) || "Price must be a number",
  ],
};

// methods
const updateItem = async () => {
  loading.value.update = true;
  try {
    const newItems = props.items.map((item) => {
      if (item.name === props.input.name) {
        return {
          ...item,
          price: price.value,
        };
      }
      return item;
    });

    await httpsCallable(
      functions,
      "updateItem"
    )({
      items: newItems,
    });
  } catch (err) {
    console.error(err);
    error.value = err as string;
  } finally {
    loading.value.update = false;
  }
};
</script>

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
          v-model="price"
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
