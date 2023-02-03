<script setup lang="ts">
import { doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";

// components
import NewItem from "@/components/admin/Item/NewItem.vue";
import ItemCard from "@/components/admin/Item/ItemCard.vue";

// firebase
const db = useFirestore();
const items = useDocument(doc(db, "admin", "items"));
</script>

<template>
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
