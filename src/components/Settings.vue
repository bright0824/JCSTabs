<script setup lang="ts">
import { functions } from "@/firebase";
import { useFCMStore } from "@/store/fcm";
import type { User } from "@/types";
import { httpsCallable } from "firebase/functions";
import { mdiBell } from "@mdi/js";

const currentUser = useCurrentUser();
const userRef = doc(useFirestore(), "users", currentUser.value?.uid || "");
const userDoc = useDocument<User>(userRef);

const fcm = useFCMStore();

const changes = ref({
  topics: {
    items: userDoc.data.value?.topics?.includes("items") || false,
  },
});

const saveChanges = async () => {
  const before = userDoc.data.value?.topics || [];
  const after = Object.entries(changes.value.topics)
    .filter(([, value]) => value)
    .map(([key]) => key);

  await updateDoc(userRef, {
    topics: after,
  });

  interface UpdateTopicsData {
    before: string[];
    after: string[];
    token: string;
  }

  await httpsCallable<UpdateTopicsData>(
    functions,
    "updateTopics"
  )({
    before,
    after,
    token: fcm.token,
  });
};

const cancel = () => {
  changes.value = {
    topics: {
      items: userDoc.data.value?.topics?.includes("items") || false,
    },
  };
};
</script>

<template>
  <VContainer fluid v-if="currentUser">
    <VRow>
      <VCol>
        <VIcon :icon="mdiBell" />
      </VCol>
      <VCol>
        <h3>
          <span class="ml-6">Topics</span>
        </h3>
      </VCol>
    </VRow>
    <VDivider class="my-2" />
    <VRow>
      <VCol>
        <VSwitch label="Items" v-model="changes.topics.items">
          <template #details>
            Receive topics when new items are available or when prices for items
            are updated. This could be a lot of notifications.
          </template>
        </VSwitch>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VBtn @click="saveChanges" color="green"> Save </VBtn>
      </VCol>
      <VCol>
        <VBtn @click="cancel" color="red"> Cancel </VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>
