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
            @click="router.push('/admin')"
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUser, useFirebaseAuth } from "vuefire";

// data
const user = useCurrentUser();
const admin = ref(false);
const router = useRouter();

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
</script>
