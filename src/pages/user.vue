<template>
  <VFadeTransition>
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
                    <tr
                      v-if="
                        countItemsInTab(userDoc.tab, items.food)[item.name] > 0
                      "
                    >
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          countItemsInTab(userDoc.tab, items.food)[item.name]
                        }}
                      </td>
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
                    v-if="getTabTotal(userDoc.tab) > 0"
                  />
                </VCol>
                <VCol align="right">
                  <h3 class="mr-2">
                    Total:
                    {{ total }}
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
                      <tr
                        v-if="
                          countItemsInTab(userDoc.tab, items.food)[item.name] >
                          0
                        "
                      >
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
                <VPagination
                  v-model="page"
                  :length="calculatePages(userDoc.tab.length, perPage)"
                />
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
                    <template
                      v-for="(item, index) in visibleItems"
                      :key="index"
                    >
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
  </VFadeTransition>
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
import type { TabItem } from "@/types";
import type { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useDocument, useFirebaseAuth, useFirestore } from "vuefire";
import {
  calculatePages,
  countItemsInTab,
  getTabTotal,
  computeVisibleItems,
} from "@/util/user";

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

// computed
const visibleItems = computed(() =>
  computeVisibleItems(userDoc.data.value?.tab, page.value, perPage)
);

const total = computed(() =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(getTabTotal(userDoc.data.value?.tab))
);

// methods
const canDelete = (date: Timestamp, item: TabItem) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000 && !item.paid;
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
