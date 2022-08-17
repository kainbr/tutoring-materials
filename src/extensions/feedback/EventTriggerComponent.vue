<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col grow">
      <EventSelector :trigger="trigger" :editor="editor" />

      <ConditionSelector :trigger="trigger" :editor="editor" />

      <FeedbackSelector :trigger="trigger" :editor="editor" />
    </div>
    <!-- Standard buttons -->
    <div class="flex gap-0.5 ml-3 h-fit">
      <EditorMenuButton :on-inactive-click="() => editor.commands.addEventTrigger(trigger)">
        <IconCopy />
      </EditorMenuButton>
      <EditorMenuButton :on-inactive-click="() => editor.commands.removeEventTrigger(trigger)">
        <IconTrash />
      </EditorMenuButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import EventSelector from "@/extensions/feedback/helpers/EventSelector.vue";
import type { PropType } from "vue";
import type { EventTrigger } from "@/extensions/feedback/types";
import ConditionSelector from "@/extensions/feedback/helpers/ConditionSelector.vue";
import FeedbackSelector from "@/extensions/feedback/helpers/FeedbackSelector.vue";
import type { Editor } from "@tiptap/vue-3";

export default defineComponent({
  name: "EventTriggerComponent",

  components: {
    EditorMenuButton,
    IconCopy,
    IconTrash,
    FeedbackSelector,
    ConditionSelector,
    EventSelector,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      required: true,
    },
  },

  emits: ["update:trigger"],

  data() {
    return {
      isValid: false,
    };
  },
});
</script>
