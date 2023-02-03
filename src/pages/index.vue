<template>
  <VContainer fluid align="center">
    <VRow>
      <VCol>
        <VProgressCircular indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/",
  "name": "home",
  "meta": {
    "requiresAuth": false,
    "transition": "fade-transition"
  }
}
</route>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useFirebaseAuth } from "vuefire";

const auth = useFirebaseAuth();
const router = useRouter();

auth?.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>
