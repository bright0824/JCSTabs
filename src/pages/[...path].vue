<script setup lang="ts">
definePage({
  name: "NotFound",
  meta: {
    transition: "fade-transition",
  },
});
</script>

<template>
  <VContainer fluid>
    <VRow>
      <VCol align="center">
        <VCard>
          <VCardTitle> Something went wrong </VCardTitle>
          <VCardText>
            <p>Sorry, we couldn't find the page you were looking for.</p>
            <p>
              Try going back to the <router-link to="/">homepage</router-link>.
            </p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
