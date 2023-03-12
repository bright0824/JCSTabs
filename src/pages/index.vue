<script setup lang="ts">
const auth = useFirebaseAuth();
const router = useRouter();

definePage({
  path: "/",
  name: "home",
  meta: {
    requiresAuth: false,
    transition: "fade-transition",
  },
});

auth?.onAuthStateChanged((user) => {
  if (user) {
    router.push("/user");
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <VContainer fluid align="center">
    <VRow>
      <VCol>
        <VProgressCircular indeterminate />
      </VCol>
    </VRow>
  </VContainer>
</template>
