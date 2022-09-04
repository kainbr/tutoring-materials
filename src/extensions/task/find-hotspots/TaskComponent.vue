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
  FHOption,
  FHEvaluation,
  FHOptions,
  FHState,
  FHProps,
  FHEmits,
} from "@/extensions/task/find-hotspots/types";
import type { Editor } from "@tiptap/vue-3";
import type { InjectedEventBus } from "@/helpers/useEventBus";

export default defineComponent({
  name: "TaskFindHotspots",

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
      type: Object as PropType<FHOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<FHOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<FHEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<FHState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<FHProps, FHEmits, FHOptions, FHOption[], FHEvaluation, FHState>(
      props,
      emit,
      []
    );

    return {
      update,
    };
  },
});
</script>
