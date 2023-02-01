<template v-if="user != null">
  <VTooltip :text="user?.info.displayName">
    <template #activator="{ props }">
      <VBtn
        icon
        v-bind="props"
        @click="dialog = true"
        :loading="dialog"
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
          </VCol>
          <VSpacer />
          <VSpacer />
          <VCol>
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
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="(item, index) in user?.tab.filter(
                      (item) => !item.paid
                    )"
                    :key="index"
                  >
                    <tr>
                      <td>{{ item.name }}</td>
                      <td>
                        {{
                          new Intl.NumberFormat("en", {
                            style: "currency",
                            currency: "CAD",
                          }).format(item.price)
                        }}
                      </td>
                      <td>{{ count[item.name] }}</td>
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
        <ClearTab :user="user" v-if="checkTabLength().currentTab" />
        <ClearHistory :user="user" v-if="checkTabLength().history" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { Item, User } from "@/types";
import { computed, ref } from "vue";

// components
import ClearHistory from "@/components/admin/User/ClearHistory.vue";
import ClearTab from "@/components/admin/User/ClearTab.vue";
import ToggleRole from "@/components/admin/User/ToggleRole.vue";

// props
const props = defineProps<{
  user: User | null;
  items: Item[];
}>();

// data
const dialog = ref(false);
const page = ref(1);
const perPage = 5;

// computed
const total = computed(() => {
  let total = 0;
  props.user?.tab
    ?.filter((item) => !item.paid)
    .forEach((item) => {
      total += item.price;
    });
  return total;
});

const visibleItems = computed(() => {
  const start = (page.value - 1) * perPage;
  const end = start + perPage;
  // @ts-expect-error
  props.user?.tab?.sort((a, b) => b.date.toDate() - a.date.toDate());
  return props.user?.tab?.slice(start, end);
});

const MathTime = () => {
  if (props.user?.tab.length) {
    return Math.ceil(props.user?.tab.length / perPage);
  }
};

const count = computed(() => {
  const count = {} as Record<string, number>;
  props.user?.tab?.forEach((item) => {
    if (count[item.name]) {
      count[item.name] += 1;
    } else {
      count[item.name] = 1;
    }
  });
  return count;
});

// methods
const checkTabLength = () => {
  return {
    currentTab: !!props.user?.tab.filter((item) => !item.paid).length,
    history: !!props.user?.tab.length,
  };
};
</script>
