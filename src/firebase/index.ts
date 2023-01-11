import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
getAnalytics(app);
getPerformance(app);
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5"),
  isTokenAutoRefreshEnabled: true,
});

export { auth, db, functions };
