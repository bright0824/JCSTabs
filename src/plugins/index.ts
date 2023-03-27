import type { App } from "vue";
import pinia from "./pinia";
import { Toast, options as ToastOptions } from "./toast";
import { VueFire, options as VueFireOptions } from "./vuefire";
import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";
import router from "@/router";

export const registerPlugins = (app: App) => {
  loadFonts();
  app.use(router);
  app.use(vuetify);
  app.use(pinia);
  app.use(VueFire, VueFireOptions);
  app.use(Toast, ToastOptions);
};
