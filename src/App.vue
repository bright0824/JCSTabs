<template>
  <VApp>
    <VAppBar color="primary" app>
      <VAppBarTitle>
        <RouterLink to="/user"> JCS Tabs </RouterLink>
      </VAppBarTitle>
      <UserProfile />
    </VAppBar>
    <VMain>
      <VContainer fluid>
        <Suspense>
          <RouterView v-slot="{ Component, route }">
            <Transition
              :name="route.meta?.transition as string || ''"
              appear
              mode="out-in"
            >
              <div :key="route.fullPath">
                <component :is="Component" />
              </div>
            </Transition>
          </RouterView>
        </Suspense>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { usePreferredDark } from "@vueuse/core";
import { useFirebaseAuth } from "vuefire";
import { useTheme } from "vuetify";

import UserProfile from "@/components/UserProfile.vue";

// data
const theme = useTheme();
const auth = useFirebaseAuth();
const prefersDark = usePreferredDark();

if (prefersDark.value) {
  theme.global.name.value = "dark";
} else {
  theme.global.name.value = "light";
}

// methods
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};
</script>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>
