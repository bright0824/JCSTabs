<template>
  <VContainer align="center" v-if="userDoc && items">
    <VRow>
      <VCol>
        <AddItemToTab :items="items.food" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle> Current Tab </VCardTitle>
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in items.food" :key="index">
                  <tr v-if="count()[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>{{ count()[item.name] }}</td>
                    <td>
                      {{
                        new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        }).format(item.price)
                      }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </VTable>
          </VCardText>
          <VCardText>
            <VRow>
              <VCol align="left">
                <ClearTab
                  :email="auth?.currentUser?.email!"
                  name="your"
                  v-if="total() > 0"
                />
              </VCol>
              <VCol align="right">
                <h3 class="mr-2">
                  Total:
                  {{
                    new Intl.NumberFormat("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    }).format(total())
                  }}
                </h3>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <h3>Recent Transactions</h3>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in userDoc.tab" :key="index">
                    <tr v-if="count()[item.name] > 0">
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleDateString() }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleTimeString() }}
                      </td>
                      <DeleteItemFromTab
                        :item="item"
                        v-if="canDelete(item.date, item.paid)"
                      />
                    </tr>
                  </template>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <h3>History</h3>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VPagination v-model="page" :length="MathTime()" />
              <VTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in visibleItems" :key="index">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleDateString() }}
                      </td>
                      <td>
                        {{ item.date.toDate().toLocaleTimeString() }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else fluid align="center">
    <VRow>
      <VCol>
        <h1>Fetching your profile...</h1>
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
  "path": "/user",
  "name": "user",
  "meta": {
    "requiresAuth": true,
    "transition": "fade-transition"
  }
}
</route>

<script setup lang="ts">
import type { Item, TabItem } from "@/types";
import type { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDocument, useFirebaseAuth, useFirestore } from "vuefire";

// components
import AddItemToTab from "@/components/userPage/AddItemToTab.vue";

const ClearTab = await import("@/components/ClearTab.vue").then(
  (m) => m.default
);
const DeleteItemFromTab = await import(
  "@/components/userPage/DeleteItemFromTab.vue"
).then((m) => m.default);

const router = useRouter();

// data
const page = ref(1);
const perPage = 5;

// firebase
const db = useFirestore();
const auth = useFirebaseAuth();

const items = useDocument(doc(db, "admin", "items"));
const userDoc = useDocument(doc(db, `users/${auth?.currentUser?.uid}`));

// computed properties
const count = () => {
  const total = {} as { [key: string]: number };
  items.data.value?.food.forEach((item: Item) => {
    total[item.name] = 0;
  });
  userDoc.data.value?.tab
    ?.filter((item: TabItem) => !item.paid)
    .forEach((item: Item) => {
      total[item.name]++;
    });
  return total;
};

const total = () => {
  let total = 0;
  userDoc.data.value?.tab?.forEach((item: Item) => {
    total += item.price;
  });
  return total;
};

const visibleItems = computed(() => {
  return userDoc.data.value?.tab
    .sort((a: TabItem, b: TabItem) => b.date.toMillis() - a.date.toMillis())
    .slice((page.value - 1) * perPage, page.value * perPage);
});

const canDelete = (date: Timestamp, item: TabItem) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000 && !item.paid;
};

// methods
const MathTime = () => {
  if (userDoc.data.value?.tab.length) {
    return Math.ceil(userDoc.data.value.tab.length / perPage);
  }
};

setTimeout(() => {
  if (!auth?.currentUser) {
    router.push({
      name: "error",
      query: {
        err: "503",
      },
    });
  }
}, 5000);

setTimeout(() => {
  if (!userDoc.value) {
    router.push({
      name: "error",
      params: {
        err: "408",
      },
    });
  }
}, 20000);
</script>
