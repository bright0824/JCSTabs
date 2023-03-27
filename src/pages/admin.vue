<script setup lang="ts">
import { mdiAccountCog, mdiArchiveCog } from "@mdi/js";
// definePage({
//   // path: "/admin",
//   name: "admin",
// });
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <KeepAlive>
      <Transition name="slide-x-transition" mode="out-in" appear>
        <div class="wrapper" :key="route.path">
          <component :is="Component" />
        </div>
      </Transition>
    </KeepAlive>
  </RouterView>
  <KeepAlive>
    <VBottomNavigation>
      <VTabs>
        <VTab value="staff" to="/admin/staff" :prependIcon="mdiAccountCog">
          Staff
        </VTab>
        <VTab value="items" to="/admin/items" :prependIcon="mdiArchiveCog">
          Items
        </VTab>
      </VTabs>
    </VBottomNavigation>
  </KeepAlive>
</template>
