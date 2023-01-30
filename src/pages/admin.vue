<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="slide-x-transition" appear mode="out-in">
      <div :key="route.path">
        <component :is="Component" />
      </div>
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
    "requiresAuth": true,
    "transition": "fade-transition"
  },
  "children": [
    {
      "path": "staff",
      "name": "Staff",
      "component": "StaffPage",
      "meta": {
        "transition": "slide-x-transition"
      }
    },
    {
      "path": "items",
      "name": "Items",
      "component": "ItemsPage",
      "meta": {
        "transition": "slide-x-transition"
      }
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
