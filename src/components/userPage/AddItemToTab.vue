<template>
  <VDialog
    v-model="dialog"
    :fullscreen="mobile"
    :max-Width="mobile ? width : '500px'"
    min-width="300px"
  >
    <template #activator="{ props }">
      <VBtn
        color="success"
        v-bind="props"
        :loading="dialog"
        :disabled="dialog"
        prepend-icon="add"
      >
        Add Item
      </VBtn>
    </template>
    <VCard>
      <VCardTitle class="text-center">
        <span>Add Item</span>
      </VCardTitle>
      <VCardText v-if="error.code !== null">
        <VAlert
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
      </VCardText>
      <VCardText v-else>
        <VBtn
          color="secondary"
          v-for="(item, index) in items"
          :key="index"
          :loading="loading[item.name]"
          :disabled="loading[item.name]"
          @click="addItem(item)"
          class="ma-1"
          width="100%"
        >
          {{ item.name }}:
          {{
            new Intl.NumberFormat("en-CA", {
              style: "currency",
              currency: "CAD",
            }).format(item.price)
          }}
        </VBtn>
      </VCardText>
      <VCardActions>
        <VBtn color="red" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { Item } from "@/types";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { ref } from "vue";
import { useFirebaseAuth, useFirestore } from "vuefire";
import { useDisplay } from "vuetify";

const db = useFirestore();
const auth = useFirebaseAuth();

const dialog = ref(false);
const loading = ref({} as Record<string, boolean>);
const error = ref({
  code: null as string | null,
  message: null as string | null,
});
const { mobile, width } = useDisplay();

const { items } = defineProps<{ items: Item[] }>();

items?.forEach((item) => {
  loading.value[item.name] = false;
});

const addItem = async (item: Item) => {
  loading.value[item.name] = true;
  if (!auth?.currentUser) return;
  try {
    await updateDoc(doc(db, "users", auth.currentUser?.uid), {
      tab: arrayUnion({
        ...item,
        date: Timestamp.now(),
        paid: false,
      }),
    });
    close();
  } catch (err) {
    const { code, message } = err as { code: string; message: string };
    error.value = { code, message };
  }
};

const close = () => {
  dialog.value = false;
  loading.value = {};
  error.value = {
    code: null,
    message: null,
  };
};
</script>
