import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import de from "@/locales/de.json";

export default createI18n({
  locale: "de", // navigator.language.split("-")[0],
  legacy: false,
  fallbackLocale: "en",
  messages: {
    en: en,
    de: de,
  },
});
