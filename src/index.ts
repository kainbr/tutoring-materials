// noinspection JSUnusedGlobalSymbols

import { createI18n } from "vue-i18n";
import { directive } from "vue-tippy";
import { version } from "../package.json";
import TutoringMaterial from "@/TutoringMaterial.vue";
import TutoringMaterialEditor from "@/TutoringMaterialEditor.vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";
import TutoringMaterialPreview from "@/TutoringMaterialPreview.vue";
import TutoringMaterialStatistics from "@/TutoringMaterialStatistics.vue";
import de from "@/locales/de.json";
import en from "@/locales/en.json";

import "tippy.js/dist/tippy.css";
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

    app.directive("tippy", directive);

    app.component("TutoringMaterial", TutoringMaterial);
    app.component("TutoringMaterialEditor", TutoringMaterialEditor);
    app.component("TutoringMaterialPlayer", TutoringMaterialPlayer);
    app.component("TutoringMaterialPreview", TutoringMaterialPreview);
    app.component("TutoringMaterialStatistics", TutoringMaterialStatistics);
  },
  version: version,
};
