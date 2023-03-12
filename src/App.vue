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
        v-if="auth?.currentUser"
      >
        <VIcon :icon="MdiCog" />
      </VBtn>
      <UserProfile />
    </VAppBar>
    <VNavigationDrawer
      v-model="openSettings"
      temporary
      :location="mobile ? 'bottom' : 'left'"
    >
      <Settings v-if="auth?.currentUser" />
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

<script setup lang="ts">
import { useDisplay, useTheme } from "vuetify";
import MdiCog from "~icons/mdi/cog";
import { activate } from "./firebase/fcm";

// data
const theme = useTheme();
const prefersDark = usePreferredDark();
const { mobile } = useDisplay();

const auth = useFirebaseAuth();
const router = useRouter();

const openSettings = ref(false);

auth?.onAuthStateChanged((user) => {
  if (!user) {
    router.push("/login");
  }

  setTimeout(() => {
    activate();
  }, 30000);
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
