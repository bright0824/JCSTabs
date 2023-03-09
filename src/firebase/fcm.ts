import { useFCMStore } from "@/store/fcm";
import { useStorage } from "@vueuse/core";
import { getToken, isSupported, onMessage } from "firebase/messaging";
import { messaging } from ".";

const storedToken = useStorage("fcmToken", "");

export const activate = async () => {
  if (await isSupported()) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Unable to get permission to notify.");
      }
    });
  }
};

getToken(messaging, {
  vapidKey:
    "BBeXegOCfTcMiYKK1PcATi7prahLmEeNvbxjDYN97EF8yqp_KflRfQHPB3HSveJbLCVKL2OSV6qMb3lC8GWWqvU",
})
  .then(async (currentToken) => {
    if (currentToken) {
      if (storedToken.value !== currentToken) {
        const fcmStore = useFCMStore();
        fcmStore.setToken(currentToken);
      }
      console.log("current token for client: ", currentToken);
    } else {
      // Show permission request UI
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });

onMessage(messaging, (payload) => {
  // display the notification
  const notificationTitle = payload.notification?.title || "";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/pwa-192x192.png",
  };

  console.log("[FCM] ", payload);

  new Notification(notificationTitle, notificationOptions);
});
