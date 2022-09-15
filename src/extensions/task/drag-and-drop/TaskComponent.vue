<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div class="bg-gray-300 h-80">
        <div ref="draggable" class="w-min border-4 border-yellow-500">Drag This</div>
      </div>
    </template>

    <!-- Content -->
    <template #content> Content </template>

    <!-- Evaluation -->
    <template #evaluation> Evaluation </template>

    <!-- Options -->
    <template #options> Options </template>
  </TaskScaffold>
</template>

<script lang="ts">
// import {  inject } from "vue";
import { defineComponent, ref, watchEffect } from "vue";
// eslint-disable-next-line
// @ts-ignore
import PlainDraggable from "plain-draggable";

import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import { useTask } from "@/extensions/task/helpers";

import type { PropType } from "vue";
import type {
  DNDOption,
  DNDEvaluation,
  DNDOptions,
  DNDState,
  DNDProps,
  DNDEmits,
} from "@/extensions/task/drag-and-drop/types";
import type { Editor } from "@tiptap/vue-3";
// import type { InjectedEventBus } from "@/helpers/useEventBus";

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
      type: Object as PropType<DNDOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<DNDOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<DNDEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<DNDState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    // const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<
      DNDProps,
      DNDEmits,
      DNDOptions,
      DNDOption[],
      DNDEvaluation,
      DNDState
    >(props, emit, []);

    const draggable = ref(null);

    watchEffect(() => {
      if (!!draggable.value) {
        new PlainDraggable(draggable.value);
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
    });

    return {
      update,
      draggable,
    };
  },
});
</script>
