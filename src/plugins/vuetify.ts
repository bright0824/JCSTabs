/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "vuetify/styles";
import { md3 } from "vuetify/blueprints";

// Composables
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    variations: {
      colors: [
        "primary",
        "secondary",
        "accent",
        "error",
        "info",
        "success",
        "warning",
      ],
      lighten: 4,
      darken: 4,
    },
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#2eacf6",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          user: "#FFF",
        },
      },
      dark: {
        colors: {
          primary: "#212121",
          secondary: "424242",
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
          user: "#313131",
        },
      },
    },
  },
});
