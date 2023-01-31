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
          <VCol>
            {{ user?.info.displayName }}
          </VCol>
        </VRow>
      </VCardTitle>
      <VCardText align="center">
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
                  <template v-for="(item, index) in user?.tab.filter((item) => !item.paid)" :key="index">
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
                      <td>{{count[item.name]}}</td>
                    </tr>
                  </template>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
          <VExpansionPanel>
            <VExpansionPanelTitle>
              History
            </VExpansionPanelTitle>
            <VExpansionPanelText>
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
                  <template v-for="(item, index) in reverseTab" :key="index">
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
        <ClearTab :user="user" v-if="checkTabLength()" />
        <ClearHistory :user="user" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { User, Item } from "@/types";
import { ref, computed } from "vue";
import ClearTab from "@/components/admin/User/ClearTab.vue";
import ClearHistory from "@/components/admin/User/ClearHistory.vue";
import ToggleRole from "@/components/admin/User/ToggleRole.vue";

// props
const props = defineProps<{
  user: User | null;
  items: Item[];
}>();

// data
const dialog = ref(false);

// computed
const total = computed(() => {
  let total = 0;
  props.user?.tab?.filter((item) => !item.paid).forEach((item) => {
    total += item.price;
  });
  return total;
});

const reverseTab = computed(() => {
  return props.user?.tab.reverse();
});

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
  if (props.user?.tab.length) {
    return props.user?.tab.length > 0;
  } else {
    return 0;
  }
};
</script>
