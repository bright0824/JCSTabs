<script setup lang="ts">
import type { Item } from "@/types";
import { useDisplay } from "vuetify";
import { mdiPlusThick } from "@mdi/js";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";

// props
const props = defineProps<{ items: Item[] }>();
const { items } = toRefs(props);

// composables
const db = useFirestore();
const auth = useFirebaseAuth();
const toast = useToast();
const i18n = useI18n();

// data
const dialog = ref(false);
const loading = ref({} as Record<string, boolean>);
const error = ref({
  code: null as string | null,
  message: null as string | null,
});
const { mobile, width } = useDisplay();

items.value?.forEach((item) => {
  loading.value[item.name] = false;
});

// methods
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

    toast.success(
      `${item.name}: ${i18n.n(item.price, "currency")} added to tab`
    );

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

<template>
  <VDialog
    v-model="dialog"
    :fullscreen="mobile"
    :max-Width="mobile ? width : '500px'"
    min-width="300px"
  >
    <template #activator="{ props }">
      <VBtn color="success" v-bind="props" :prepend-icon="mdiPlusThick">
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
          {{ $n(item.price, "currency") }}
        </VBtn>
        <CustomItem @close="close" />
      </VCardText>
      <VCardActions>
        <VBtn color="red" @click="close()"> Cancel </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
