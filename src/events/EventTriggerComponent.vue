<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-col grow">
      <div class="flex flex-row items-center">
        <span class="text-sm">If</span>

        <!-- Event selector -->
        <EventSelector :trigger="trigger" :editor="editor" />

        <!-- Condition selector -->
        <ConditionSelector :trigger="trigger" :editor="editor" />
      </div>

      <div class="flex flex-row items-center">
        <span class="text-sm py-1.5"> then </span>

        <!-- Scaffold selector -->
        <ScaffoldSelector :trigger="trigger" :editor="editor" />
      </div>
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
import EventSelector from "@/events/helpers/EventSelector.vue";
import type { PropType } from "vue";
import type { EventTrigger } from "@/types";
import ConditionSelector from "@/events/helpers/ConditionSelector.vue";
import ScaffoldSelector from "@/events/helpers/ScaffoldSelector.vue";
import type { Editor } from "@tiptap/vue-3";

export default defineComponent({
  name: "EventTriggerComponent",

  components: {
    EditorMenuButton,
    IconCopy,
    IconTrash,
    ScaffoldSelector,
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
