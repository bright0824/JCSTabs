<script setup lang="ts">
import type { User, Item } from "@/types";
import { useDocument, useCollection, useFirestore } from "vuefire";
import { collection, doc } from "firebase/firestore";

import UserCard from "@/components/admin/User/UserCard.vue";

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as string[];

// firestore snapshots
const db = useFirestore();
const users = useCollection(collection(db, "users"));
const items = useDocument(doc(db, "admin", "items"));

// methods
const filterUsers = (letter: string) => {
  return users?.value.filter((user) => {
    return user.info.displayName
      .split(" ")[1]
      ?.toLowerCase()
      .startsWith(letter);
  });
};
</script>

<template>
  <VContainer fluid v-if="users && items">
    <VRow>
      <VExpansionPanels>
        <template v-for="letter in letters" :key="letter">
          <VExpansionPanel
            :id="letter"
            :value="letter"
            class="ma-2"
            v-if="filterUsers(letter).length > 0"
          >
            <VExpansionPanelTitle>
              <VRow>
                <VCol cols="12">
                  <b class="text-h5">{{ letter.toUpperCase() }}</b>
                </VCol>
              </VRow>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <template v-for="user in filterUsers(letter)" :key="user">
                <UserCard
                  :user="(user as User)"
                  :items="(items.food as Item[])"
                />
              </template>
            </VExpansionPanelText>
          </VExpansionPanel>
        </template>
      </VExpansionPanels>
    </VRow>
  </VContainer>
  <VContainer fluid v-else>
    <VRow>
      <VCol align="center">
        <h1>Fetching users...</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <VProgressLinear indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/admin/staff",
  "name": "admin-staff",
  "meta": {
    "requiresAuth": true,
    "requiresAdmin": true
  }
}
</route>
