<template>
  <div class="w-full">
    <span v-if="scaffolds.length === 0" class="text-sm ml-2.5">{{
      $t("editor:footer:feedback-empty-list")
    }}</span>
    <ul v-else class="divide-y divide-gray-200" role="list">
      <li
        v-for="scaffold in scaffolds"
        :key="scaffold.id"
        class="py-1"
        @mouseenter="stateStore.addScaffold(scaffold)"
        @mouseleave="stateStore.removeScaffold(scaffold)"
      >
        <component
          :is="scaffold.type"
          :key="scaffold.config"
          :editor="editor"
          :scaffold="scaffold"
        ></component>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ScaffoldMark from "./mark/ConfigurationComponent.vue";
import ScaffoldNotification from "./notification/ConfigurationComponent.vue";
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { Scaffold } from "@/types";

export default defineComponent({
  name: "ScaffoldConfigurationComponent",

  components: {
    "scaffold-mark": ScaffoldMark,
    "scaffold-notification": ScaffoldNotification,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    scaffolds: {
      type: Array as PropType<Scaffold[]>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },
});
</script>
