<template>
  <div class="flex flex-row items-center justify-between">
    <div
      v-if="hasPreview"
      v-tippy="$t('editor.menu.feedback-toggle-tooltip')"
      class="flex flex-row gap-2 items-center cursor-pointer"
      @click="toggleActiveFeedback"
    >
      <span class="flex-none text-sm" :class="{ 'font-semibold': isActive }">
        <LabelComponent :label="feedback.label" />
      </span>
    </div>
    <div v-else class="flex flex-row gap-2 items-center">
      <span class="flex-none text-sm">
        <LabelComponent :label="feedback.label" />
      </span>
    </div>

    <div class="flex grow flex-row items-center justify-end">
      <div class="flex flex-auto gap-0.5 px-1 justify-end">
        <slot name="default"></slot>
      </div>
      <div class="flex flex-none gap-0.5 ml-3">
        <EditorMenuButton v-tippy="$t('editor.menu.feedback-copy-tooltip')" @click="copy">
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
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "FeedbackConfigurationComponent",

  components: { LabelComponent, IconTrash, IconCopy, EditorMenuButton },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    feedback: {
      type: Object as PropType<Feedback>,
      required: true,
    },
    hasPreview: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const isActive = computed(() => {
      return props.editor.storage.feedbacks.active.find(
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
      const uid = uuid();
      props.editor.commands.addFeedback({
        ...props.feedback,
        id: uid,
        label: !!props.feedback.label
          ? {
              ...props.feedback.label,
              hexIcon: calculateHexIcon(uid),
            }
          : undefined,
      });
    };

    const remove = () => {
      props.editor.commands.removeActiveFeedback(props.feedback);
      props.editor.commands.removeFeedback(props.feedback);
    };

    return { isActive, toggleActiveFeedback, copy, remove };
  },
});
</script>
