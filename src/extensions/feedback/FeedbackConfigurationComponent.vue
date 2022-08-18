<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-row gap-2 items-center">
      <span class="text-sm">
        <LabelComponent :label="feedback.label"></LabelComponent>
      </span>
    </div>

    <div class="flex grow flex-row items-center justify-end">
      <div class="flex grow gap-0.5 px-1 justify-end">
        <slot name="default"></slot>
      </div>

      <div class="flex gap-0.5 ml-3">
        <EditorMenuButton :on-inactive-click="copyFeedback">
          <IconCopy />
        </EditorMenuButton>
        <EditorMenuButton :on-inactive-click="removeFeedback">
          <IconTrash />
        </EditorMenuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { calculateHexIcon } from "@/helpers/util";
import { defineComponent } from "vue";
import { v4 as uuid } from "uuid";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import LabelComponent from "@/helpers/LabelComponent.vue";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { StoredFeedback } from "@/extensions/feedback/types";

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
  },

  methods: {
    copyFeedback() {
      // Make a copy of the current feedback and overwrite id and hexIcon
      const copyFeedback = { ...this.feedback };
      const uid = uuid();
      copyFeedback.id = uid;
      copyFeedback.label = { ...copyFeedback.label, hexIcon: calculateHexIcon(uid) };
      this.editor.commands.addFeedback(copyFeedback);
    },
    removeFeedback() {
      this.editor.commands.removeActiveFeedback(this.feedback);
      this.editor.commands.removeFeedback(this.feedback);
    },
  },
});
</script>
