import { functions } from "@/firebase";
import type { User } from "@/types";
import { httpsCallable } from "@firebase/functions";
import { useStorage } from "@vueuse/core";
import { doc } from "firebase/firestore";
import { defineStore } from "pinia";
import { useCurrentUser, useDocument, useFirestore } from "vuefire";

export const useFCMStore = defineStore("token", {
  state: () => ({
    token: useStorage("fcmToken", ""),
  }),
  actions: {
    setToken(token: string) {
      if (token === this.token) return;
      updateSubscription(token).then(() => {
        this.token = token;
      });
    },
  },
});

const updateSubscription = async (token: string) => {
  const userDoc = useDocument<User>(
    doc(useFirestore(), `users/${useCurrentUser().value?.uid}`)
  );

  console.log("userDoc loading", userDoc.pending.value);

  // once the userDoc is loaded, we can update the subscription
  if (!userDoc.pending.value) {
    return await httpsCallable(
      functions,
      "subscribeToTopic"
    )({
      token,
      topics: userDoc.data.value?.topics,
      oldToken: useFCMStore().token,
    });
  }
};
