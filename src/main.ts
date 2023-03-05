import { ReCaptchaV3Provider } from "firebase/app-check";
import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import { VueFire, VueFireAppCheck, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

loadFonts();

const intervalMS = 60 * 60 * 1000;

registerSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
  onNeedRefresh() {
    window.location.reload();
  },
});

const app = createApp(App);

if (import.meta.env.DEV) {
  // @ts-expect-error
  self.FIREBASE_APPCHECK_DEBUG_TOKEN =
    import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
}

app.use(VueFire, {
  firebaseApp,
  modules: [
    VueFireAuth(),
    VueFireAppCheck({
      provider: new ReCaptchaV3Provider(
        "6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5"
      ),
      isTokenAutoRefreshEnabled: true,
      debug: import.meta.env.DEV
        ? import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN
        : false,
    }),
  ],
});
app.use(router);
app.use(vuetify);

app.use(createPinia());

app.mount("#app");
