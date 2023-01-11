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
    "requiresAuth": false
  }
}
</route>
