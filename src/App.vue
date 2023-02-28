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
              mode="out-in"
              appear
            >
              <div :key="(route?.name as string)">
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
import { usePreferredDark, useWebNotification } from "@vueuse/core";
import { useTheme } from "vuetify";
import UserProfile from "@/components/UserProfile.vue";
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router/auto";

// data
const theme = useTheme();
const prefersDark = usePreferredDark();

const auth = useFirebaseAuth();
const router = useRouter();

auth?.onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }
});

// computed
if (prefersDark.value) {
  theme.global.name.value = "dark";
} else {
  theme.global.name.value = "light";
}
</script>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>
