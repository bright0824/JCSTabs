<template>
  <VContainer align="center">
    <VRow>
      <VCol>
        <h1>There was an error talking to firebase</h1>
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VBtn @click="$router.back()">Try Again</VBtn>
      </VCol>
    </VRow>
  </VContainer>
</template>

<route lang="json">
{
  "path": "/error",
  "name": "error",
  "meta": {
    "requiresAuth": false
  }
}
</route>
