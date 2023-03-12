<script setup lang="ts">
import type { Item, User } from "@/types";
import {
  calculatePages,
  computeVisibleItems,
  countItemsInTab,
  dedupeArray,
  getTabTotal,
} from "@/utils";
import { useDisplay } from "vuetify";

// props
const props = defineProps<{
  user: User;
  items: Item[];
}>();

const { user } = toRefs(props);

// data
const dialog = ref(false);
const page = ref(1);

const { mobile } = useDisplay();

// computed
const visibleItems = computed(() =>
  computeVisibleItems(user.value?.tab, page.value, 5)
);

const total = computed(() => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(getTabTotal(user.value?.tab));
});

// methods
const checkTabLength = () => {
  return {
    currentTab: !!user.value?.tab.filter((item) => !item.paid).length,
    history: !!user.value?.tab.length,
  };
};
</script>

<template v-if="user != null">
  <VTooltip :text="user?.info.displayName" :disabled="mobile">
    <template #activator="{ props }">
      <VBtn
        icon
        v-bind="props"
        @click="dialog = true"
        color="secondary"
        class="ml-1"
      >
        <VAvatar>
          <VImg :src="user?.info.photoURL" :alt="user?.info.displayName" />
        </VAvatar>
      </VBtn>
    </template>
  </VTooltip>
  <VDialog v-model="dialog" :fullscreen="mobile">
    <VCard>
      <VCardTitle>
        <VRow>
          <VCol>
            <VAvatar>
              <VImg :src="user?.info.photoURL" alt="User Avatar" />
            </VAvatar>

            {{ user?.info.displayName }}
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText>
        <h3 align="center">Current Tab {{ total }}</h3>
        <VTable>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in dedupeArray(user.tab)"
              :key="index"
            >
              <tr v-if="countItemsInTab(user.tab)[item.name] > 0">
                <td>{{ item.name }}</td>
                <td>{{ countItemsInTab(user.tab)[item.name] }}</td>
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
      <VDivider class="my-1" />
      <VCardText>
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle> History </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VPagination
                v-model="page"
                :length="calculatePages(user.tab.length, 5)"
                :totalVisible="calculatePages(user.tab.length, 5)"
              />
              <VTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Paid</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="item in visibleItems" :key="item">
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>{{ item.paid ? "Yes" : "No" }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                      <td>{{ item.date.toDate().toLocaleDateString() }}</td>
                      <td>{{ item.date.toDate().toLocaleTimeString() }}</td>
                    </tr>
                  </template>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VCardText>
      <VDivider />
      <VCardText>
        <span>Roles:</span>
        <ToggleRole :user="user" role="admin" />
      </VCardText>
      <VCardActions>
        <VBtn color="auto" @click="dialog = false">Close</VBtn>
        <ClearTab
          :email="user?.info.email!"
          :name="user?.info.displayName! + `'s`"
          v-if="checkTabLength().currentTab"
        />
        <ClearHistory :user="user" v-if="checkTabLength().history" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
