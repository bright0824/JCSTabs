import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

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
const firestore = getFirestore(firebaseApp);

enableIndexedDbPersistence(firestore).catch((err) => {
  if (err.code === "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...

    console.error(
      "Multiple tabs open, persistence can only be enabled in one tab at a a time."
    );
  } else if (err.code === "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...

    console.error(
      "The current browser does not support all of the features required to enable persistence"
    );
  }
});

// getAnalytics(firebaseApp);
// getPerformance(firebaseApp);

export { firebaseApp, functions, messaging };
