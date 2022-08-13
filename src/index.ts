import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import VueTippy from "vue-tippy";
import TutoringMaterial from "@/TutoringMaterial.vue";
import TutoringMaterialEditor from "@/TutoringMaterialEditor.vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";
import TutoringMaterialPreview from "@/TutoringMaterialPreview.vue";
import TutoringMaterialStatistics from "@/TutoringMaterialStatistics.vue";
// Todo: Fix import error of locales files.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import de from "@/locales/de.json";
// Todo: Fix import error of locales files
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import en from "@/locales/en.json";
import "tippy.js/themes/light-border.css";
import "./index.css";
import type { App } from "vue";

export default {
  install: (app: App) => {
    app.config.unwrapInjectedRef = true;

    app.use(
      createI18n({
        locale: navigator.language.split("-")[0],
        fallbackLocale: "en",
        messages: {
          en: en,
          de: de,
        },
      })
    );

    app.use(createPinia());

    app.use(VueTippy);

    app.component("TutoringMaterial", TutoringMaterial);
    app.component("TutoringMaterialEditor", TutoringMaterialEditor);
    app.component("TutoringMaterialPlayer", TutoringMaterialPlayer);
    app.component("TutoringMaterialPreview", TutoringMaterialPreview);
    app.component("TutoringMaterialStatistics", TutoringMaterialStatistics);
  },
};
