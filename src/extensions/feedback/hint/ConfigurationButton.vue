<template>
  <EditorMenuButton tabindex="-1" :active="!!feedback" @click="open = true">
    <IconFeedback />
    <ConfigurationModal
      v-model:open="open"
      :editor="editor"
      :parent="parent"
      :reference="reference"
    ></ConfigurationModal>
  </EditorMenuButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfigurationModal from "@/extensions/feedback/hint/ConfigurationModal.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconFeedback from "@/helpers/icons/IconFeedback.vue";

import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import type { StoredFeedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "ConfigurationButton",

  components: {
    ConfigurationModal,
    IconFeedback,
    EditorMenuButton,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    parent: {
      type: String,
      required: true,
    },
    reference: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },

  data() {
    return {
      open: false,
    };
  },

  computed: {
    feedback() {
      return this.editor
        .getAttributes("document")
        .feedbacks.find(
          (f: StoredFeedback) =>
            f.type === "feedback-hint" &&
            f.parent === this.parent &&
            (f as HintFeedback).config.reference === this.reference
        );
    },
  },
});
</script>
