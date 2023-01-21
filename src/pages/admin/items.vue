<template>
  <VContainer v-if="items!.food">
    <VRow class="text-center">
      <VCol>
        <AddItem />
      </VCol>
    </VRow>
    <VRow class="text-center">
      <VCol v-for="(item, index) in items?.food" :key="index" align="center">
        <ItemCard :items="items?.food" :input="item" />
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
import { doc } from "firebase/firestore";
import { useFirestore, useDocument } from "vuefire";

// components
import AddItem from "@/components/admin/Item/AddItem.vue";
import ItemCard from "@/components/admin/Item/ItemCard.vue";

// firebase
const db = useFirestore();
const items = useDocument(doc(db, "admin", "items"));
</script>
