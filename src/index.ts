import TutoringMaterial from "@/TutoringMaterial.vue";
import TutoringMaterialEditor from "@/TutoringMaterialEditor.vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";
import TutoringMaterialPreview from "@/TutoringMaterialPreview.vue";
import TutoringMaterialStatistics from "@/TutoringMaterialStatistics.vue";
import { createPinia } from "pinia";
import { createI18n } from "vue-i18n";
import "./index.css";
import type { App } from "vue";

export default {
  install: (app: App) => {
    app.config.unwrapInjectedRef = true;

    app.use(createPinia());

    app.use(
      createI18n({
        // something vue-i18n options here ...
      })
    );

    app.component("TutoringMaterial", TutoringMaterial);
    app.component("TutoringMaterialEditor", TutoringMaterialEditor);
    app.component("TutoringMaterialPlayer", TutoringMaterialPlayer);
    app.component("TutoringMaterialPreview", TutoringMaterialPreview);
    app.component("TutoringMaterialStatistics", TutoringMaterialStatistics);
  },
};
