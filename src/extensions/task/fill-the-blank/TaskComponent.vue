<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div class="text-justify">
        <div v-for="i in [1, 2, 3]" :key="i" class="inline">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna
          <Listbox>
            <div class="relative w-fit inline-block">
              <ListboxButton
                class="relative cursor-pointer border border-blue-700 rounded-lg bg-white py-0 pl-2 pr-8 text-left shadow-md"
              >
                <span class="block truncate">Select option</span
                ><span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <IconDropDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <ListboxOptions
                class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-0 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="option in ['Option 1', 'Option 2', 'Option 3']"
                  v-slot="{ active }"
                  :key="option"
                  as="template"
                >
                  <div
                    :class="[
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                      'relative cursor-pointer select-none p-2',
                    ]"
                  >
                    <span :class="['block truncate']" class="pl-8">
                      {{ option }}
                    </span>
                    <span
                      v-if="option === 'Option 1'"
                      class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                    >
                      <IconCheck class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
          aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          Stet clita kasd gubergren.
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
// import { inject } from "vue";
import { defineComponent } from "vue";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

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
// import type { InjectedEventBus } from "@/helpers/useEventBus";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import IconCheck from "@/extensions/infobox/icons/IconCheck.vue";

export default defineComponent({
  name: "TaskFillTheBlank",

  components: {
    IconCheck,
    IconDropDown,
    TaskScaffold,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
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
    // const { eventBus } = inject("eventBus") as InjectedEventBus;

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
