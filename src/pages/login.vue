<script setup lang="ts">
import { ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";

// data
const loggedIn = ref(false);
const alert = ref(false);
const error = ref({
  message: "",
  status: "",
});

const ignoreErrorCode = [
  "auth/account-exists-with-different-credential",
  "auth/credential-already-in-use",
  "auth/cancelled-popup-request",
  "auth/popup-closed-by-user",
];

const router = useRouter();
const auth = useFirebaseAuth()!;
const provider = new GoogleAuthProvider();

// computed
auth.onAuthStateChanged((user) => {
  if (user) {
    router.push({ name: "user" });
    loggedIn.value = true;
  }
});

// methods
const signIn = () => {
  signInWithPopup(auth, provider).catch((err) => {
    if (!ignoreErrorCode.includes(err.code)) {
      try {
        const { error } = JSON.parse(err.message.match(/{.*}/g));
        error.value = error;
      } catch {
        error.value = {
          message: err.message,
          status: err.code,
        };
      }
    }
  });
};
</script>

<template>
  <VRow justify="center">
    <VCard color="secondary" width="300" class="text-center mt-45">
      <VCardTitle class="text-center">
        <h1>Login</h1>
      </VCardTitle>
      <VDivider />
      <VCardText v-if="!loggedIn">
        <VAlert type="error" v-if="alert" variant="outlined" prominent>
          <VAlertTitle>
            {{ error.status.replace("_", " ") }}
          </VAlertTitle>
          {{ error.message }}
          <VDivider />
          <VBtn variant="text" class="float-right" @click="alert = false">
            Dismiss
          </VBtn>
        </VAlert>
        <VBtn @click="signIn()" v-if="!alert">
          <VImg
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            style="width: 20px; height: 20px; margin-right: 10px"
            icon
          />
          Continue with Google
        </VBtn>
      </VCardText>
      <VCardText v-else>
        <VProgressLinear indeterminate />
      </VCardText>
    </VCard>
  </VRow>
</template>

<route lang="json">
{
  "path": "/login",
  "name": "login",
  "meta": {
    "requiresAuth": false,
    "transition": "fade-transition"
  }
}
</route>
