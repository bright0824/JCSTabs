<template>
  <VApp>
    <VAppBar color="primary" app>
      <VAppBarNavIcon color="auto" icon="home" @click="router.push('/user')" />
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
        <RouterView v-slot="{ Component }">
          <Transition name="fade-transition" appear>
            <component :is="Component" />
          </Transition>
        </RouterView>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

import UserProfile from "@/components/UserProfile.vue";
//components
// const UserProfile = () => import("@/components/UserProfile.vue");

// data
const loggedIn = ref(false);
const theme = useTheme();
const auth = useFirebaseAuth()!;
const router = useRouter();

auth.onAuthStateChanged((user) => {
  loggedIn.value = !!user;
});

// methods
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
};

if (localStorage.getItem("theme")) {
  theme.global.name.value = localStorage.getItem("theme") as string;
}
</script>
