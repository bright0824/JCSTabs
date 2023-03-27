import { createI18n } from "vue-i18n";

const numberFormats = {
  "en-CA": {
    currency: {
      style: "currency",
      currency: "CAD",
    },
  },
};

const i18n = createI18n({
  locale: "en-CA",
  legacy: false,
  numberFormats,
});

export default i18n;
