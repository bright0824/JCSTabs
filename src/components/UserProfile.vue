<template>
  <VMenu rounded v-if="user" :close-on-content-click="false" v-model="active">
    <template #activator="{ props }">
      <VBtn icon v-bind="props">
        <VAvatar>
          <VImg :src="(user?.photoURL as string)" />
        </VAvatar>
      </VBtn>
    </template>
    <VCard color="user">
      <VCardText>
        <VRow>
          <VCol cols="3">
            <VAvatar size="large">
              <VImg :src="(user?.photoURL as string)" alt="Avatar" />
            </VAvatar>
          </VCol>
          <VCol>
            <h3>{{ user?.displayName }}</h3>
            <p class="text-caption mt-1">{{ user?.email }}</p>
          </VCol>
        </VRow>
        <VRow>
          <VDivider class="my-1" />
          <VBtn
            variant="text"
            color="auto"
            @click="
              logout();
              active = false;
            "
            block
            class="justify-start"
            :prepend-icon="MdiLogout"
          >
            Sign out
          </VBtn>
        </VRow>
        <VRow v-if="admin">
          <VDivider class="my-1" />
          <VBtn
            variant="text"
            color="auto"
            @click="
              router.push('/admin/staff');
              active = false;
            "
            block
            class="justify-start"
            :prepend-icon="MdiSecurity"
          >
            Admin Menu
          </VBtn>
        </VRow>
        <VRow>
          <VDivider class="my-1" />
          <VBtn
            variant="text"
            color="auto"
            class="justify-start"
            @click="toggleTheme"
            block
            :prepend-icon="
              theme.global.name.value === 'light'
                ? MdiWhiteBalanceSunny
                : MdiWeatherNight
            "
          >
            Theme: {{ theme.global.name.value }}
          </VBtn>
        </VRow>
        <VRow>
          <VDivider class="my-1" />
          <FeedBack />
        </VRow>
      </VCardText>
    </VCard>
  </VMenu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUser, useFirebaseAuth } from "vuefire";
import { useTheme } from "vuetify";

import MdiLogout from "~icons/mdi/logout";
import MdiSecurity from "~icons/mdi/security";
import MdiWhiteBalanceSunny from "~icons/mdi/white-balance-sunny";
import MdiWeatherNight from "~icons/mdi/weather-night";
// data
const data = () => {
  return {
    user: useCurrentUser(),
    router: useRouter(),
    theme: useTheme(),
    admin: ref(false),
    active: ref(false),
  };
};
const { user, router, theme, admin, active } = data();

// firebase
const auth = useFirebaseAuth()!;

auth.onAuthStateChanged((currentUser) => {
  if (currentUser) {
    currentUser?.getIdTokenResult().then((idTokenResult) => {
      admin.value = idTokenResult.claims.admin;
    });
  }
});

// methods
/**
 * Sign out the current user and redirect to the login page
 */
const logout = () => {
  auth.signOut();
  router.push("/login");
};

/**
 * Toggle the theme between light and dark
 */
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};
</script>
