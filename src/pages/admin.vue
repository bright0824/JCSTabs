<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide-x-transition" mode="out-in" appear>
      <KeepAlive :include="['Staff', 'Items']">
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
  <VBottomNavigation>
    <VTabs>
      <VTab value="staff" to="/admin/staff">
        <VIcon icon="manage_accounts" />
        Staff
      </VTab>
      <VTab value="items" to="/admin/items">
        <VIcon icon="inventory_2" />
        Items
      </VTab>
    </VTabs>
  </VBottomNavigation>
</template>

<route lang="json">
{
  "path": "/admin",
  "name": "AdminPage",
  "component": "AdminPage",
  "meta": {
    "requiresAuth": true
  },
  "children": [
    {
      "path": "staff",
      "name": "Staff",
      "component": "StaffPage"
    },
    {
      "path": "items",
      "name": "Items",
      "component": "ItemsPage"
    }
  ]
}
</route>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  if (router.currentRoute.value.path === "/admin") {
    router.push({ name: "admin-staff" });
  }
});
</script>
