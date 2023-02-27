<script setup lang="ts">
import ItemCard from "@/components/admin/Item/ItemCard.vue";
import NewItem from "@/components/admin/Item/NewItem.vue";
import type { Items } from "@/types";
import { doc } from "firebase/firestore";
import { computed } from "vue";
import { useDocument, useFirestore } from "vuefire";

// firebase
const db = useFirestore();
const items = useDocument<Items>(doc(db, "admin", "items"));

// computed
const isLoading = computed(() => {
  return items.pending.value ? true : false;
});
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
  >
    <h1>Fetching items...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
  <VContainer v-if="items">
    <VRow class="text-center">
      <VCol>
        <NewItem />
      </VCol>
    </VRow>
    <VRow class="text-center">
      <VCol v-for="(item, index) in items?.food" :key="index" align="center">
        <ItemCard :items="items?.food" :input="item" />
      </VCol>
    </VRow>
  </VContainer>
</template>
