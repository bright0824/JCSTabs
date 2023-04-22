<script setup lang="ts">
import type { Items, TabItem, User } from "@/types";
import {
  calculatePages,
  computeVisibleItems,
  countItemsInTab,
  dedupeArray,
  getTabTotal,
} from "@/utils";
import type { Timestamp } from "firebase/firestore";
import { useI18n } from "vue-i18n";

// composables
definePage({
  path: "/user",
  name: "user",
  meta: {
    requiresAuth: true,
    transition: "fade-transition",
  },
});

const router = useRouter();
const i18n = useI18n();

// data
const page = ref(1);
const perPage = 5;

// firebase
const db = useFirestore();
const auth = useFirebaseAuth();

const items = useDocument<Items>(doc(db, "admin", "items"));
const userDoc = useDocument<User>(doc(db, `users/${auth?.currentUser?.uid}`));

// computed
const visibleItems = computed(() =>
  computeVisibleItems([...(userDoc.data.value?.tab ?? [])], page.value, perPage)
);

const dedupedTab = computed(() => dedupeArray(userDoc.data.value?.tab ?? []));

const isLoading = computed(() => {
  if (items.pending.value || userDoc.pending.value) {
    return true;
  } else {
    return false;
  }
});

const total = computed(() =>
  i18n.n(getTabTotal(userDoc.data.value?.tab ?? []), "currency")
);

// methods
const canDelete = (date: Timestamp, paid: Boolean) => {
  const now = new Date();
  const diff = now.getTime() - date.toDate().getTime();
  return diff < 300000 && !paid;
};

userDoc.error.value && router.push("/error");
</script>

<template>
  <VOverlay
    persistent
    :close-on-content-click="false"
    class="align-center justify-center"
    :model-value="isLoading"
    rounded
  >
    <h1>Fetching your profile...</h1>
    <VProgressLinear indeterminate rounded stream />
  </VOverlay>
  <VContainer align="center" v-if="userDoc && items">
    <VRow>
      <VCol>
        <AddItemToTab :items="items.food" />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle> Recent Transactions </VCardTitle>
          <VCardText>
            <VTable>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <template
                  v-for="(item, index) in userDoc.tab.filter((e: TabItem) => !e.paid).reverse()"
                  :key="index"
                >
                  <tr v-if="countItemsInTab(userDoc.tab)[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>
                      {{ $n(item.price, "currency") }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleDateString() }}
                    </td>
                    <td>
                      {{ item.date.toDate().toLocaleTimeString() }}
                    </td>
                    <td>
                      <DeleteItemFromTab
                        :item="item"
                        v-if="canDelete(item.date, item.paid)"
                      />
                    </td>
                  </tr>
                </template>
              </tbody>
            </VTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle> Summary </VCardTitle>
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
                <template v-for="(item, index) in dedupedTab" :key="index">
                  <tr v-if="countItemsInTab(userDoc.tab)[item.name] > 0">
                    <td>{{ item.name }}</td>
                    <td>
                      {{ countItemsInTab(userDoc.tab)[item.name] }}
                    </td>
                    <td>
                      {{ $n(item.price, "currency") }}
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
                  <template v-for="(item, index) in visibleItems" :key="index">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>
                        {{ $n(item.price, "currency") }}
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
</template>
