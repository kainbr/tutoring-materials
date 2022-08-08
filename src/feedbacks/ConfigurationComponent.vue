<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-row gap-2 items-center">
      <!-- Title -->
      <span class="text-sm">
        <!-- eslint-disable vue/no-v-html -->
        <span class="pl-2 pr-3" v-html="calculateHexIcon(feedback.id)" />
        <slot name="title">{{ feedback.type }}</slot>
      </span>
    </div>

    <div class="flex grow flex-row items-center justify-end">
      <!-- Configuration -->
      <div class="flex grow gap-0.5 px-1 justify-end">
        <slot name="default"></slot>
      </div>

      <!-- Standard buttons -->
      <div class="flex gap-0.5 ml-3">
        <EditorMenuButton :on-inactive-click="() => editor.commands.addFeedback(feedback)">
          <IconCopy />
        </EditorMenuButton>
        <EditorMenuButton :on-inactive-click="() => editor.commands.removeFeedback(feedback)">
          <IconTrash />
        </EditorMenuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Feedback } from "@/types";
import { calculateHexIcon } from "@/helpers/util";

export default defineComponent({
  name: "FeedbackConfigurationComponent",

  components: { IconTrash, IconCopy, EditorMenuButton },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    feedback: {
      type: Object as PropType<Feedback>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  methods: {
    calculateHexIcon(str: string | undefined) {
      return calculateHexIcon(str);
    },
  },
});
</script>
