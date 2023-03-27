<script setup lang="ts">
import { useDisplay, useTheme } from "vuetify";
import { mdiCog } from "@mdi/js";
import { activate } from "./firebase/fcm";

// composables
const theme = useTheme();
const prefersDark = usePreferredDark();
const { mobile } = useDisplay();

const auth = useFirebaseAuth();
const router = useRouter();

// data
const openSettings = ref(false);
const loggedIn = ref(false);

// computed
auth?.onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }

  loggedIn.value = !!user;

  setTimeout(() => {
    activate();
  }, 30000);
});

if (prefersDark.value) {
  theme.global.name.value = "dark";
} else {
  theme.global.name.value = "light";
}
</script>

<template>
  <VApp>
    <VAppBar color="primary" app>
      <VAppBarTitle>
        <RouterLink to="/user"> JCS Tabs </RouterLink>
      </VAppBarTitle>
      <VBtn
        icon
        @click="openSettings = !openSettings"
        color="auto"
        v-if="loggedIn"
      >
        <VIcon :icon="mdiCog" />
      </VBtn>
      <UserProfile />
    </VAppBar>
    <VNavigationDrawer
      v-model="openSettings"
      temporary
      :location="mobile ? 'bottom' : 'left'"
    >
      <Settings v-if="loggedIn" />
    </VNavigationDrawer>
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

<style scoped>
a {
  color: white;
  text-decoration: none;
}
</style>
