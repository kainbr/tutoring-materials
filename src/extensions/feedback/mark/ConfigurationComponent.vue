<template>
  <feedback-configuration-component :editor="editor" :feedback="feedback">
    <template #default>
      <!-- Bold -->
      <MenuButton
        v-tippy="$t('editor.menu.feedback-typography-bold-tooltip')"
        :active="!!feedback.config.bold"
        :on-active-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, bold: undefined },
            })
        "
        :on-inactive-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, bold: {} },
            })
        "
      >
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
          />
        </svg>
      </MenuButton>

      <!-- Italic -->
      <MenuButton
        v-tippy="$t('editor.menu.feedback-typography-italic-tooltip')"
        :active="!!feedback.config.italic"
        :on-active-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, italic: undefined },
            })
        "
        :on-inactive-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, italic: {} },
            })
        "
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </MenuButton>

      <!-- Underline -->
      <MenuButton
        v-tippy="$t('editor.menu.feedback-typography-underline-tooltip')"
        :active="!!feedback.config.underline"
        :on-active-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, underline: undefined },
            })
        "
        :on-inactive-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, underline: {} },
            })
        "
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z" />
        </svg>
      </MenuButton>

      <!-- Highlight -->
      <MenuButton
        v-tippy="$t('editor.menu.feedback-typography-highlight-tooltip')"
        :active="!!feedback.config.highlight"
        :on-active-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, highlight: undefined },
            })
        "
        :on-inactive-click="
          () =>
            editor.commands.updateFeedback(feedback, {
              config: { ...feedback.config, highlight: {} },
            })
        "
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15.243 4.515l-6.738 6.737-.707 2.121-1.04 1.041 2.828 2.829 1.04-1.041 2.122-.707 6.737-6.738-4.242-4.242zm6.364 3.535a1 1 0 0 1 0 1.414l-7.779 7.779-2.12.707-1.415 1.414a1 1 0 0 1-1.414 0l-4.243-4.243a1 1 0 0 1 0-1.414l1.414-1.414.707-2.121 7.779-7.779a1 1 0 0 1 1.414 0l5.657 5.657zm-6.364-.707l1.414 1.414-4.95 4.95-1.414-1.414 4.95-4.95zM4.283 16.89l2.828 2.829-1.414 1.414-4.243-1.414 2.828-2.829z"
          />
        </svg>
      </MenuButton>
    </template>
  </feedback-configuration-component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FeedbackConfigurationComponent from "@/extensions/feedback/FeedbackConfigurationComponent.vue";
import MenuButton from "@/helpers/EditorMenuButton.vue";

import type { Editor } from "@tiptap/vue-3";
import type { MarkFeedback } from "@/extensions/feedback/mark/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "FeedbackMarkConfigurationComponent",

  components: { MenuButton, FeedbackConfigurationComponent },

  props: {
    feedback: {
      type: Object as PropType<MarkFeedback>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },
});
</script>
