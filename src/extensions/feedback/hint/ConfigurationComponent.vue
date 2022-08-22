<template>
  <feedback-configuration-component
    :editor="editor"
    :feedback="feedback"
    :create-feedback="createFeedback"
    :update-feedback="updateFeedback"
    :remove-feedback="removeFeedback"
  >
    <template #default>
      <button
        type="button"
        class="mx-3 flex-shrink-0 text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="open = true"
      >
        {{ $t("editor.feedback.hint-modal-edit-button") }}
      </button>
      <ConfigurationModal
        v-model:open="open"
        :editor="editor"
        :parent="feedback.parent"
        :reference="feedback.config.reference"
      />
    </template>
  </feedback-configuration-component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FeedbackConfigurationComponent from "@/extensions/feedback/FeedbackConfigurationComponent.vue";

import type { Editor, NodeWithPos } from "@tiptap/vue-3";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import type { PropType } from "vue";
import ConfigurationModal from "@/extensions/feedback/hint/ConfigurationModal.vue";
import { findChildren } from "@tiptap/core";
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "FeedbackHintConfigurationComponent",

  components: {
    ConfigurationModal,
    FeedbackConfigurationComponent,
  },

  props: {
    feedback: {
      type: Object as PropType<HintFeedback>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
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

  data() {
    return {
      open: false,
    };
  },

  /*
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

   */
});
</script>
