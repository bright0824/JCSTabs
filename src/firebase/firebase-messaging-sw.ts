import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAlFp1mxhtzaCy16eXFKX9glqWDAiyS_hg",
  authDomain: "jcs-tab-tracker.firebaseapp.com",
  projectId: "jcs-tab-tracker",
  storageBucket: "jcs-tab-tracker.appspot.com",
  messagingSenderId: "557593235569",
  appId: "1:557593235569:web:f48c54248eae89d86f4bd0",
  measurementId: "G-KXRF1B2ZEJ",
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message ", payload);
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/pwa-512x512.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
