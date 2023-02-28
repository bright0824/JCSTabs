<script setup lang="ts">
import UserCard from "@/components/admin/User/UserCard.vue";
import type { Item, Items, User } from "@/types";
import { collection, doc } from "firebase/firestore";
import { computed } from "vue";
import { useCollection, useDocument, useFirestore } from "vuefire";

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
const users = useCollection<User>(collection(db, "users"));
const items = useDocument<Items>(doc(db, "admin", "items"));

// computed

const isLoading = computed(() => {
  if (users.pending.value || items.pending.value) {
    return true;
  } else {
    return false;
  }
});

console.log(users.data.value);

// methods
const filterUsers = (letter: string) => {
  return users?.data.value.filter((user: User) => {
    return user?.info.displayName
      .split(" ")[1]
      ?.toLowerCase()
      .startsWith(letter);
  });
};
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
  >
    <h1>Fetching staff list...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
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
                <UserCard :user="user" :items="(items.food as Item[])" />
              </template>
            </VExpansionPanelText>
          </VExpansionPanel>
        </template>
      </VExpansionPanels>
    </VRow>
  </VContainer>
</template>
