<template>
  <EditorMenuButton tabindex="-1" :active="!!feedback" @click="open = true">
    <IconFeedback />
    <ConfigurationModal
      v-model:open="open"
      :editor="editor"
      :parent="parent"
      :reference="reference"
      @create:feedback="createFeedback($event)"
      @update:feedback="updateFeedback($event)"
      @remove:feedback="removeFeedback()"
    ></ConfigurationModal>
  </EditorMenuButton>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConfigurationModal from "@/extensions/feedback/hint/ConfigurationModal.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconFeedback from "@/helpers/icons/IconFeedback.vue";

import type { Editor, NodeWithPos } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import type { Feedback } from "@/extensions/feedback/types";
import { findChildren } from "@tiptap/core";

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
    createFeedback: {
      type: Function,
      required: true,
    },
    updateFeedback: {
      type: Function,
      required: true,
    },
    removeFeedback: {
      type: Function,
      required: true,
    },
  },

  emits: ["update:open", "create:feedback", "update:feedback", "remove:feedback"],

  data() {
    return {
      open: false,
    };
  },

  computed: {
    feedback() {
      const task: NodeWithPos = findChildren(
        this.editor.state.doc,
        (node) => node.type.name === "task" && node.attrs.id === this.parent
      )[0];

      if (!!task) {
        return task.node.attrs.feedbacks.find(
          (f: Feedback) =>
            f.type === "feedback-hint" && (f as HintFeedback).config.reference === this.reference
        );
      } else {
        return undefined;
      }
    },
  },
});
</script>
