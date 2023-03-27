import type { App } from "vue";
import pinia from "./pinia";
import { Toast, options as ToastOptions } from "./toast";
import { VueFire, options as VueFireOptions } from "./vuefire";
import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";
import router from "@/router";
import i18n from "./i18n";

export const registerPlugins = (app: App) => {
  loadFonts();
  app.use(router);
  app.use(vuetify);
  app.use(pinia);
  app.use(i18n);
  app.use(VueFire, VueFireOptions);
  app.use(Toast, ToastOptions);
};
