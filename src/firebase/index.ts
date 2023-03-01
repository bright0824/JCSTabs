import { updateDoc, doc, arrayUnion, Timestamp } from "@firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getPerformance } from "firebase/performance";
import { useFirestore } from "vuefire";

const firebaseConfig = {
  apiKey: "AIzaSyAlFp1mxhtzaCy16eXFKX9glqWDAiyS_hg",
  authDomain: "jcs-tab-tracker.firebaseapp.com",
  projectId: "jcs-tab-tracker",
  storageBucket: "jcs-tab-tracker.appspot.com",
  messagingSenderId: "557593235569",
  appId: "1:557593235569:web:f48c54248eae89d86f4bd0",
  measurementId: "G-KXRF1B2ZEJ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const functions = getFunctions(firebaseApp);
const messaging = getMessaging(firebaseApp);

getAnalytics(firebaseApp);
getPerformance(firebaseApp);

getToken(messaging, {
  vapidKey:
    "BBeXegOCfTcMiYKK1PcATi7prahLmEeNvbxjDYN97EF8yqp_KflRfQHPB3HSveJbLCVKL2OSV6qMb3lC8GWWqvU",
})
  .then(async (currentToken) => {
    if (currentToken) {
      console.log("current token for client: ", currentToken);

      const db = useFirestore();

      const token = {
        token: currentToken,
        createdAt: Timestamp.now(),
      }

      await updateDoc(doc(db, 'admin/FCM'), {
        tokens: arrayUnion(token)
      })

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

  console.log("[FCM] ", payload)

  new Notification(notificationTitle, notificationOptions);
});

connectFunctionsEmulator(functions, "localhost", 5001);

export { firebaseApp, functions, messaging };
