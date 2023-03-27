import { ReCaptchaV3Provider } from "firebase/app-check";
import { VueFire, VueFireAppCheck, VueFireAuth } from "vuefire";
import { firebaseApp } from "@/firebase";

const options = {
  firebaseApp,
  modules: [
    VueFireAuth(),
    VueFireAppCheck({
      provider: new ReCaptchaV3Provider(
        "6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5"
      ),
      isTokenAutoRefreshEnabled: true,
      debug: import.meta.env.DEV
        ? import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN || true
        : false,
    }),
  ],
};

export { VueFire, options };
