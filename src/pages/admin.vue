<script setup lang="ts">
import { ref } from "vue";
// const StaffPage = async () => {
//   await import("@/pages/admin/staff.vue").then((m) => m.default);
// };
// const ItemsPage = async () => {
//   await import("@/pages/admin/items.vue").then((m) => m.default);
// };

const window = ref(0);
</script>

<route lang="json">
{
  "path": "/admin",
  "name": "admin",
  "component": "Admin",
  "children": [
    {
      "path": "staff",
      "name": "admin-staff",
      "component": "StaffPage"
    },
    {
      "path": "items",
      "name": "admin-items",
      "component": "ItemsPage"
    }
  ]
}
</route>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive>
      <Transition name="slide-x-transition" appear mode="out-in">
        <component :is="Component" :key="route.name" />
      </Transition>
    </KeepAlive>
  </RouterView>
  <KeepAlive>
    <VBottomNavigation>
      <VTabs>
        <VTab value="staff" to="/admin/staff">
          <MdiAccountCog class="mr-1" />
          Staff
        </VTab>
        <VTab value="items" to="/admin/items">
          <MdiArchiveCog class="mr-1" />
          Items
        </VTab>
      </VTabs>
    </VBottomNavigation>
  </KeepAlive>
</template>
