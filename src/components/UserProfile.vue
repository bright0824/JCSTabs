<template>
  <VMenu rounded v-if="user !== null">
    <template #activator="{ props }">
      <VBtn icon v-bind="props">
        <VAvatar>
          <VImg :src="(user?.photoURL as string)" />
        </VAvatar>
      </VBtn>
    </template>
    <VCard color="user">
      <VCardText class="mx-auto text-center">
        <VAvatar size="large">
          <VImg :src="(user?.photoURL as string)" alt="Avatar" />
        </VAvatar>
        <h3>{{ user?.displayName }}</h3>
        <p class="text-caption mt-1">{{ user?.email }}</p>
        <template v-if="admin">
          <VDivider class="my-3" />
          <VBtn
            rounded
            variant="text"
            color="auto"
            @click="router.push('/admin/staff')"
            prepend-icon="admin_panel_settings"
          >
            admin menu
          </VBtn>
        </template>
        <VDivider class="my-3" />
        <VBtn
          rounded
          variant="text"
          color="auto"
          @click="logout()"
          prepend-icon="logout"
        >
          logout
        </VBtn>
      </VCardText>
    </VCard>
  </VMenu>
</template>

<script setup lang="ts">
import type { User } from "firebase/auth";

// data
const user = ref<User | null>(null);
const admin = ref(false);
const router = useRouter();
// eslint-disable-next-line no-undef

auth.onAuthStateChanged((currentUser) => {
  if (currentUser) {
    currentUser?.getIdTokenResult().then((idTokenResult) => {
      admin.value = idTokenResult.claims.admin;
    });
    user.value = currentUser;
  } else {
    user.value = null;
  }
});

// methods
const logout = () => {
  auth.signOut();
};
</script>
