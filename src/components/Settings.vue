<script setup lang="ts">
import { doc, updateDoc } from "@firebase/firestore";
import { ref } from "vue";
import { useCurrentUser, useDocument, useFirestore } from "vuefire";
import MdiBell from "~icons/mdi/bell";
import type { User } from "@/types";

const currentUser = useCurrentUser();

const userRef = doc(useFirestore(), "users", currentUser.value?.uid || "");

const userDoc = useDocument<User>(userRef);

const topics = ["items"];

const changes = ref({
  topics: topics.reduce((acc, topic) => {
    if (userDoc.value?.topics) {
      acc[topic] = userDoc.value?.topics?.includes(topic) || false;
    }
    return acc;
  }, {} as Record<string, boolean>),
});

const saveChanges = async () => {
  await updateDoc(userRef, {
    topics: changes.value.topics,
  });
};

const cancel = () => {
  changes.value.topics = topics.reduce((acc, topic) => {
    acc[topic] = userDoc.value?.topics?.includes(topic) || false;
    return acc;
  }, {} as Record<string, boolean>);
};
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol>
        <h3>
          <MdiBell class="mr-6" />
          <span>topics</span>
        </h3>
      </VCol>
    </VRow>
    <VDivider class="my-2" />
    <VRow>
      <VCol>
        <VSwitch label="Items" v-model="changes.topics.items">
          <template #details>
            Receive topics when new items are available or when prices for items
            are updated. This could be a lot of topics.
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
