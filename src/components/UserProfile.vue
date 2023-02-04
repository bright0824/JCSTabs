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
          >
            <MdiLogout class="mr-2" />
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
          >
            <MdiSecurity class="mr-2" />
            Admin Menu
          </VBtn>
        </VRow>
        <VRow>
          <VDivider class="my-1" />
          <VBtn
            variant="text"
            color="auto"
            block
            class="justify-start"
            @click="toggleTheme"
          >
            <VFabTransition>
              <MdiWhiteBalanceSunny
                v-if="theme.global.name.value == 'light'"
                class="mr-2"
              />
              <MdiWeatherNight v-else class="mr-2" />
            </VFabTransition>
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

// data
const user = useCurrentUser();
const admin = ref(false);
const router = useRouter();
const theme = useTheme();

const active = ref(false);

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
const logout = () => {
  auth.signOut();
  router.push("/login");
};

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
};
</script>
