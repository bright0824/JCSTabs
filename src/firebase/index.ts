import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

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

connectFunctionsEmulator(functions, "localhost", 5001);

export { firebaseApp, functions, messaging };
