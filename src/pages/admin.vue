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
