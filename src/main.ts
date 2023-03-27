import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";

import App from "./App.vue";
import { registerPlugins } from "./plugins";

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

registerPlugins(app);

app.mount("#app");
