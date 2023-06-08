// noinspection JSUnusedGlobalSymbols
import { directive } from "vue-tippy";
import { version } from "../package.json";
import TutoringMaterial from "@/TutoringMaterial.vue";
import i18n from "@/i18n";

import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "./index.css";

import type { App } from "vue";

export default {
  install: (app: App) => {
    app.use(i18n);

    app.directive("tippy", directive);

    app.component("TutoringMaterial", TutoringMaterial);
  },
  version: version,
};
