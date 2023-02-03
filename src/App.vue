<template>
  <VApp>
    <VAppBar color="primary" app>
      <VAppBarNavIcon
        color="auto"
        icon="home"
        @click="router.push({ name: 'user' })"
      />
      <VAppBarTitle> JCS Tabs </VAppBarTitle>
      <VBtn icon @click="toggleTheme" color="auto">
        <Transition name="fade-transition" mode="out-in">
          <VIcon icon="light_mode" v-if="theme.global.name.value == 'light'" />
          <VIcon icon="dark_mode" v-else />
        </Transition>
      </VBtn>
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
import { ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";
import { usePreferredDark } from "@vueuse/core";

import UserProfile from "@/components/UserProfile.vue";

// data
const loggedIn = ref(false);
const theme = useTheme();
const auth = useFirebaseAuth()!;
const router = useRouter();

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
