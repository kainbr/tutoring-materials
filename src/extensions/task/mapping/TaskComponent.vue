<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-if="width < 400" class="text-center">
        Bitte den Bildschirm drehen, um die Aufgabe anzuzeigen.
      </div>
      <div v-else class="grid grid-cols-3">
        <div class="flex flex-col gap-2">
          <div
            v-for="o in startOptions"
            :key="o"
            ref="startRefs"
            class="p-1 border-2 m-1 rounded-xl text-center"
          >
            {{ o }}
          </div>
        </div>
        <div></div>
        <div class="flex flex-col gap-2">
          <div
            v-for="o in endOptions"
            :key="o"
            ref="endRefs"
            class="p-1 border-2 my-1 rounded-xl text-center"
          >
            {{ o }}
          </div>
        </div>
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
import { defineComponent, inject, onUnmounted, ref, watch, watchEffect } from "vue";

import LeaderLine from "leader-line-new";

import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import { useTask } from "@/extensions/task/helpers";

import type { PropType, Ref } from "vue";
import type {
  MAPOption,
  MAPEvaluation,
  MAPOptions,
  MAPState,
  MAPProps,
  MAPEmits,
} from "@/extensions/task/mapping/types";
import type { Editor } from "@tiptap/vue-3";
// import type { InjectedEventBus } from "@/helpers/useEventBus";
import type { InjectedContainerDimensions } from "@/helpers/useContainerDimensions";

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
      type: Object as PropType<MAPOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<MAPOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<MAPEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<MAPState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    // const { eventBus } = inject("eventBus") as InjectedEventBus;

    const startOptions = ref(["Option L1", "Option L2", "Option L3", "Option L4"]);
    const endOptions = ref(["Option R1", "Option R2", "Option R3", "Option R4"]);

    const startRefs = ref([]);
    const endRefs = ref([]);

    const line: Ref<null | LeaderLine> = ref(null);

    const { update } = useTask<
      MAPProps,
      MAPEmits,
      MAPOptions,
      MAPOption[],
      MAPEvaluation,
      MAPState
    >(props, emit, []);

    const { width } = inject("containerDimensions") as InjectedContainerDimensions;

    watch(width, () => {
      if (
        !!startRefs.value &&
        startRefs.value.length > 0 &&
        !!endRefs.value &&
        endRefs.value.length > 0
      ) {
        if (!!line.value) line.value.remove();
        line.value = new LeaderLine(startRefs.value[0], endRefs.value[1]);
      }

      if (width.value < 400 && !!line.value) {
        line.value.hide();
      }
    });

    watchEffect(() => {
      if (
        !!startRefs.value &&
        startRefs.value.length > 0 &&
        !!endRefs.value &&
        endRefs.value.length > 0
      ) {
        if (!!line.value) line.value.remove();
        line.value = new LeaderLine(startRefs.value[0], endRefs.value[1]);
      } else {
        // not mounted yet, or the element was unmounted (e.g. by v-if)
      }
    });

    onUnmounted(() => {
      if (!!line.value) line.value.remove();
    });

    return {
      update,
      startOptions,
      startRefs,
      endOptions,
      endRefs,
      width,
    };
  },
});
</script>
