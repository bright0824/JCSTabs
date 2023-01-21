import { createApp } from "vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { registerSW } from "virtual:pwa-register";
import { VueFire, VueFireAuth, VueFireAppCheck } from "vuefire";
import { firebaseApp } from "./firebase";
import { ReCaptchaV3Provider } from "firebase/app-check";

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

app.use(router);
app.use(vuetify);
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
    VueFireAppCheck({
      provider: new ReCaptchaV3Provider(
        "6LfgHEEgAAAAAEaYmNJkZHGvxQ4-c6syHPdOb5r5"
      ),
      isTokenAutoRefreshEnabled: true,
    }),
  ],
});

app.mount("#app");
