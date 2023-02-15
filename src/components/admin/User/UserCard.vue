<template v-if="user != null">
  <VTooltip :text="user?.info.displayName">
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
  <VDialog v-model="dialog" maxWidth="80%" maxheight="80%">
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
        <VExpansionPanels>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              Tab
              <vSpacer />
              Total: ${{ total }}
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VTable>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in items" :key="index">
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
            </VExpansionPanelText>
          </VExpansionPanel>
          <VExpansionPanel>
            <VExpansionPanelTitle> History </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VPagination
                v-model="page"
                :length="MathTime()"
                :totalVisible="MathTime()"
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
                          new Intl.NumberFormat("en", {
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

<script setup lang="ts">
import type { Item, TabItem, User } from "@/types";
import { computed, ref } from "vue";

// components
import ClearHistory from "@/components/admin/User/ClearHistory.vue";
// import ClearTab from "@/components/admin/User/ClearTab.vue";
import ToggleRole from "@/components/admin/User/ToggleRole.vue";

const ClearTab = await import("@/components/ClearTab.vue").then(
  (m) => m.default
);

// props
const { user, items } = defineProps<{
  user: User;
  items: Item[];
}>();

// data
const dialog = ref(false);
const page = ref(1);
const perPage = 5;

// computed
const total = computed(() => {
  let total = 0;
  user?.tab
    ?.filter((item) => !item.paid)
    .forEach((item) => {
      total += item.price;
    });
  return total;
});

const count = () => {
  const total = {} as { [key: string]: number };
  items?.forEach((item: Item) => {
    total[item.name] = 0;
  });
  user?.tab
    ?.filter((item: TabItem) => !item.paid)
    .forEach((item: Item) => {
      total[item.name]++;
    });
  return total;
};

const visibleItems = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  // @ts-expect-error
  user?.tab?.sort((a, b) => b.date.toDate() - a.date.toDate());
  return user?.tab?.slice(start, end);
});

const MathTime = () => {
  if (user?.tab.length) {
    return Math.ceil(user?.tab.length / perPage);
  }
};

// methods
const checkTabLength = () => {
  return {
    currentTab: !!user?.tab.filter((item) => !item.paid).length,
    history: !!user?.tab.length,
  };
};
</script>
