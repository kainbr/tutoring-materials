<template>
  <div class="flex flex-row items-center justify-between">
    <div
      v-tippy="$t('editor.menu.feedback-toggle-tooltip')"
      class="flex flex-row gap-2 items-center cursor-pointer"
      @click="toggleActiveFeedback"
    >
      <span
        class="text-sm"
        :class="{
          'font-semibold': isActive,
        }"
      >
        <LabelComponent :label="feedback.label"></LabelComponent>
      </span>
    </div>

    <div class="flex grow flex-row items-center justify-end">
      <div class="flex grow gap-0.5 px-1 justify-end">
        <slot name="default"></slot>
      </div>

      <div class="flex gap-0.5 ml-3">
        <EditorMenuButton
          v-tippy="$t('editor.menu.feedback-copy-tooltip')"
          :on-inactive-click="copy"
        >
          <IconCopy />
        </EditorMenuButton>
        <EditorMenuButton v-tippy="$t('editor.menu.feedback-remove-tooltip')" @click="remove">
          <IconTrash />
        </EditorMenuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { calculateHexIcon } from "@/helpers/util";
import { computed, defineComponent } from "vue";
import { isEqual } from "lodash-es";
import { v4 as uuid } from "uuid";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import LabelComponent from "@/helpers/LabelComponent.vue";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Feedback, StoredFeedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "FeedbackConfigurationComponent",

  components: { LabelComponent, IconTrash, IconCopy, EditorMenuButton },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    feedback: {
      type: Object as PropType<StoredFeedback>,
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

  setup(props) {
    const isActive = computed(() => {
      return props.editor.storage.feedbacks.activeFeedbacks.find(
        (f: Feedback) =>
          f.type === props.feedback.type &&
          f.parent === props.feedback.parent &&
          isEqual(f.config, props.feedback.config)
      );
    });

    const toggleActiveFeedback = () => {
      if (isActive.value) {
        props.editor.commands.removeActiveFeedback(props.feedback);
      } else {
        props.editor.commands.addActiveFeedback(props.feedback);
      }
    };

    const copy = () => {
      // Make a copy of the current feedback and overwrite id and hexIcon
      const copyFeedback = { ...props.feedback };
      const uid = uuid();
      copyFeedback.id = uid;
      copyFeedback.label = { ...copyFeedback.label, hexIcon: calculateHexIcon(uid) };
      props.createFeedback(copyFeedback);
    };

    const remove = () => {
      props.editor.commands.removeActiveFeedback(props.feedback);
      props.removeFeedback(props.feedback);
    };

    return { isActive, toggleActiveFeedback, copy, remove };
  },
});
</script>
