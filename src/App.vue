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
      <UserProfile v-if="loggedIn" />
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
import { auth } from "@/firebase";

// data
const loggedIn = ref(false);
const theme = useTheme();

const router = useRouter();

// computed
auth.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
    loggedIn.value = true;
  } else {
    router.push("/login");
    loggedIn.value = false;
  }
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
