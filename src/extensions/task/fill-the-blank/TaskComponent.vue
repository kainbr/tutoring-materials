<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render> Render </template>

    <!-- Content -->
    <template #content> Content </template>

    <!-- Evaluation -->
    <template #evaluation> Evaluation </template>

    <!-- Options -->
    <template #options> Options </template>
  </TaskScaffold>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import { useTask } from "@/extensions/task/helpers";

import type { PropType } from "vue";
import type {
  FTBOption,
  FTBEvaluation,
  FTBOptions,
  FTBState,
  FTBProps,
  FTBEmits,
} from "@/extensions/task/fill-the-blank/types";
import type { Editor } from "@tiptap/vue-3";
import type { InjectedEventBus } from "@/helpers/useEventBus";

export default defineComponent({
  name: "TaskFillTheBlank",

  components: {
    TaskScaffold,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    options: {
      type: Object as PropType<FTBOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<FTBOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<FTBEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<FTBState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<
      FTBProps,
      FTBEmits,
      FTBOptions,
      FTBOption[],
      FTBEvaluation,
      FTBState
    >(props, emit, []);

    return {
      update,
    };
  },
});
</script>
