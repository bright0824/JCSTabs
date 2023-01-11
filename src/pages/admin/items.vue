<template>
  <VContainer v-if="items.length">
    <VRow class="text-center">
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow class="text-center">
      <VCol v-for="(item, index) in items" :key="index" align="center">
        <ItemCard :items="items" :input="item" />
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else>
    <VRow>
      <VCol align="center">
        <h1>Fetching items...</h1>
      </VCol>
    </VRow>
    <VRow align="center">
      <VCol cols="12">
        <VProgressLinear indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/admin/items",
  "name": "admin-items",
  "meta": {
    "requiresAuth": true,
    "requiresAdmin": true
  }
}
</route>

<script setup lang="ts">
import type { Item } from "@/types";

// data
const items = ref([] as Item[]);

const itemSnap = onSnapshot(doc(db, "admin/items"), (doc) => {
  if (doc.exists()) {
    items.value = doc.data().food as Item[];
  }
});

if (!auth.currentUser) {
  itemSnap();
}
</script>
