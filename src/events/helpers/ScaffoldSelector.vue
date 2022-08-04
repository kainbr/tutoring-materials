<template>
  <div class="flex flex-row w-full flex-wrap items-center">
    <div v-for="(scaffoldId, index) in trigger.scaffoldIds" :key="scaffoldId">
      <span
        class="cursor-default inline-flex flex-nowrap items-center m-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        @mouseenter="
          stateStore.addScaffold(
            document.node.attrs.scaffolds.find((scaffold) => scaffold.id === scaffoldId)
          )
        "
        @mouseleave="
          stateStore.removeScaffold(
            document.node.attrs.scaffolds.find((scaffold) => scaffold.id === scaffoldId)
          )
        "
      >
        <!-- eslint-disable vue/no-v-html -->
        <span class="pr-1" v-html="calculateHexIcon(scaffoldId)" />
        <span>
          {{
            document.node.attrs.scaffolds.find((scaffold) => scaffold.id === scaffoldId)?.type ||
            "No type found"
          }}
        </span>
        <button
          class="cursor-pointer flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-700 hover:bg-green-200 hover:text-green-800 focus:outline-none focus:bg-green-800 focus:text-white"
          type="button"
          @click="
            editor.commands.updateEventTrigger(trigger, {
              scaffoldIds: trigger.scaffoldIds.filter((s) => scaffoldId !== s),
            })
          "
        >
          <span class="sr-only">Remove scaffold</span>
          <IconClose class="h-3 w-3 fill-green-700" />
        </button>
      </span>
      <span v-if="index < trigger.scaffoldIds.length - 1">and </span>
    </div>
    <Combobox
      :model-value="trigger.scaffoldIds"
      multiple
      nullable
      @update:model-value="
        editor.commands.updateEventTrigger(trigger, {
          scaffoldIds: $event,
        })
      "
    >
      <ComboboxButton class="cursor-pointer">
        <span
          v-if="trigger.scaffoldIds.length === 0"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          Select scaffold
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          +
        </span>
      </ComboboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ComboboxOptions
          class="absolute z-50 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="p-1">
            <ComboboxInput
              :display-trigger="(option) => option?.label"
              class="w-full w-40 border-none py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0"
              @change="scaffoldsQuery = $event.target.value"
            />
          </div>

          <ComboboxOption
            v-for="option in filteredScaffoldOptions"
            :key="option"
            v-slot="{ active, selected }"
            :value="option"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'flex flex-row w-full cursor-default select-none py-2',
              ]"
              @mouseenter="
                stateStore.addScaffold(
                  document.node.attrs.scaffolds.find((scaffold) => scaffold.id === option)
                )
              "
              @mouseleave="
                stateStore.removeScaffold(
                  document.node.attrs.scaffolds.find((scaffold) => scaffold.id === option)
                )
              "
            >
              <span class="px-2" v-html="calculateHexIcon(option)" />
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                document.node.attrs.scaffolds.find((scaffold) => scaffold.id === option)?.type ||
                "No type found"
              }}</span>
            </li>
          </ComboboxOption>
          <li
            v-if="filteredScaffoldOptions.length === 0"
            class="text-gray-900 w-full cursor-default select-none py-2 pl-4 pr-4"
          >
            <span class="font-normal text-xs block truncate">No scaffolds configured</span>
          </li>
        </ComboboxOptions>
      </transition>
    </Combobox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import type { EventTrigger, Scaffold } from "@/types";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import { findChildren } from "@tiptap/core";
import IconClose from "@/helpers/icons/IconClose.vue";
import { calculateHexIcon } from "@/helpers/util";

export default defineComponent({
  name: "ScaffoldSelector",

  components: {
    IconClose,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
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
      scaffoldsQuery: "",
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  computed: {
    document() {
      return findChildren(this.editor.state.doc, (node) => node.type.name === "document")[0];
    },
    scaffoldOptions() {
      return this.document.node.attrs.scaffolds.map((scaffold: Scaffold) => scaffold.id);
    },
    filteredScaffoldOptions() {
      return this.scaffoldsQuery === ""
        ? this.scaffoldOptions
        : this.scaffoldOptions.filter((option: string) =>
            option
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.scaffoldsQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  methods: {
    calculateHexIcon(str: string) {
      return calculateHexIcon(str);
    },
  },
});
</script>
