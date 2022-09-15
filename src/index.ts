// noinspection JSUnusedGlobalSymbols
import { directive } from "vue-tippy";
import { version } from "../package.json";
import TutoringMaterial from "@/TutoringMaterial.vue";
import TutoringMaterialEditor from "@/TutoringMaterialEditor.vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";
import TutoringMaterialPreview from "@/TutoringMaterialPreview.vue";
import TutoringMaterialStatistics from "@/TutoringMaterialStatistics.vue";
import i18n from "@/i18n";

import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "@benrbray/prosemirror-math/style/math.css";
import "katex/dist/katex.min.css";
import "./index.css";

import type { App } from "vue";

export default {
  install: (app: App) => {
    app.config.unwrapInjectedRef = true;

    app.use(i18n);

    app.directive("tippy", directive);

    app.component("TutoringMaterial", TutoringMaterial);
    app.component("TutoringMaterialEditor", TutoringMaterialEditor);
    app.component("TutoringMaterialPlayer", TutoringMaterialPlayer);
    app.component("TutoringMaterialPreview", TutoringMaterialPreview);
    app.component("TutoringMaterialStatistics", TutoringMaterialStatistics);
  },
  version: version,
};
