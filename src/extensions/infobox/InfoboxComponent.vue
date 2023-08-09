<template>
  <node-view-wrapper
    :class="{
      'bg-blue-100 ': node.attrs.color === 'blue',
      'bg-red-100': node.attrs.color === 'red',
      'bg-amber-100': node.attrs.color === 'amber',
      'bg-green-100': node.attrs.color === 'green',
    }"
    class="flex w-full px-4 mb-4 rounded-lg"
  >
    <div class="flex flex-col w-full rounded-md py-2">
      <!-- Configuration menu -->
      <div
        v-if="isEditableReactive"
        class="flex flex-row items-center pb-2 mb-2 border-b-2 border-slate-300"
        contenteditable="false"
      >
        <!-- Drag Handle -->
        <div contenteditable="false" data-drag-handle draggable="true" class="cursor-grab">
          <IconDragHandle />
        </div>
        <div class="flex flex-row grow items-center justify-center gap-4">
          <!-- Icon -->
          <div class="flex flex-row items-center">
            <span class="text-sm"> {{ $t("editor.infobox.icon-description") }}: </span>
            <Listbox
              :model-value="node.attrs.icon"
              class="ml-2 w-56"
              @update:model-value="updateAttributes({ icon: $event })"
            >
              <div class="relative">
                <ListboxButton
                  class="relative w-full rounded-lg bg-white py-1.5 pl-2.5 pr-8 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate">
                    {{
                      $t(
                        "editor.infobox.label-" +
                        iconOptions.find((option) => option === node.attrs.icon)
                      )
                    }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <IconDropDown />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    style="padding-left: 0"
                  >
                    <!--suppress JSValidateTypes -->
                    <ListboxOption
                      v-for="option in iconOptions"
                      v-slot="{ active, selected }"
                      :key="option"
                      :value="option"
                      as="template"
                      class="cursor-pointer"
                    >
                      <li
                        class="flex items-center"
                        :class="[
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          'relative py-2 my-0 pl-10 pr-4',
                          selected ? 'bg-amber-100' : '',
                        ]"
                      >
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                          {{ $t("editor.infobox.label-" + option) }}
                        </span>
                        <span
                          class="absolute inset-y-0 left-0 flex items-center m-0.5 pl-1.5 w-7 h-7"
                          :class="[active ? 'fill-amber-900' : 'fill-slate-800']"
                        >
                          <component :is="option" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <!-- Color -->
          <div class="flex flex-row items-center">
            <span class="text-sm"> {{ $t("editor.infobox.color-description") }}: </span>
            <Listbox :model-value="node.attrs.color" class="ml-2 w-32">
              <div class="relative">
                <ListboxButton
                  class="relative w-full rounded-lg bg-white py-1.5 pl-2.5 pr-8 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate">
                    {{
                      $t(
                        "editor.infobox.color-label-" +
                        colorOptions.find((option) => option === node.attrs.color)
                      )
                    }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <IconDropDown />
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    style="padding-left: 0"
                  >
                    <!--suppress JSValidateTypes -->
                    <ListboxOption
                      v-for="option in colorOptions"
                      :key="option"
                      v-slot="{ active, selected }"
                      :value="option"
                      as="template"
                      class="cursor-pointer"
                      @click="updateAttributes({ color: option })"
                    >
                      <li
                        :class="[
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          'relative py-2 my-0 pl-10 pr-4',
                        ]"
                      >
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                          {{ $t("editor.infobox.color-label-" + option) }}
                        </span>
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3.5">
                          <span
                            aria-hidden="true"
                            class="h-3.5 w-3.5 border-opacity-10 rounded-full"
                            :class="{
                              'bg-blue-600 ': option === 'blue',
                              'bg-red-600 ': option === 'red',
                              'bg-amber-600 ': option === 'amber',
                              'bg-green-600 ': option === 'green',
                            }"
                          />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>

        <div>
          <IconClose @click="deleteNode()" />
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-row w-full items-start">
        <!-- Icon -->

        <div class="mx-auto flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 mt-1">
        <component
          :is="node.attrs.icon"
          :class="{
            'fill-blue-800 ': node.attrs.color === 'blue',
            'fill-red-800 ': node.attrs.color === 'red',
            'fill-amber-800 ': node.attrs.color === 'amber',
            'fill-green-800 ': node.attrs.color === 'green',
          }"
        />
        </div>

        <!-- Text -->
        <div class="ml-3">
          <div class="flex w-full h-full">
            <node-view-content
              class="w-full not-prose"
              :class="{
                'text-blue-800 ': node.attrs.color === 'blue',
                'text-red-800 ': node.attrs.color === 'red',
                'text-amber-800 ': node.attrs.color === 'amber',
                'text-green-800 ': node.attrs.color === 'green',
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
/* eslint-disable vue/no-unused-components */
import { defineComponent, inject } from "vue";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import IconAlarm from "@/extensions/infobox/icons/IconAlarm.vue";
import IconCheck from "@/extensions/infobox/icons/IconCheck.vue";
import IconClose from "@/helpers/icons/IconClose.vue";
import IconDragHandle from "@/helpers/icons/IconDragHandle.vue";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import IconExclamationMark from "@/extensions/infobox/icons/IconExclamationMark.vue";
import IconLightBulb from "@/extensions/infobox/icons/IconLightBulb.vue";
import IconQuestionMark from "@/extensions/infobox/icons/IconQuestionMark.vue";

import type { PropType } from "vue";
import type { NodeViewProps } from "@tiptap/core";

export default defineComponent({
  name: "InfoboxComponent",

  components: {
    IconClose,
    IconDragHandle,
    IconDropDown,
    IconExclamationMark,
    IconQuestionMark,
    IconAlarm,
    IconCheck,
    IconLightBulb,
    NodeViewWrapper,
    NodeViewContent,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  },

  props: {
    editor: { type: Object as PropType<NodeViewProps["editor"]>, required: true },
    node: { type: Object as PropType<NodeViewProps["node"]>, required: true },
    decorations: { type: Object as PropType<NodeViewProps["decorations"]>, required: true },
    // selected: { type: Boolean as PropType<NodeViewProps["selected"]>, required: true },
    extension: { type: Object as PropType<NodeViewProps["extension"]>, required: true },
    getPos: { type: Function as PropType<NodeViewProps["getPos"]>, required: true },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true
    },
    deleteNode: { type: Function as PropType<NodeViewProps["deleteNode"]>, required: true }
  },

  setup(props) {
    const isEditableReactive: Boolean = inject("isEditableReactive", props.editor.isEditable);
    return { isEditableReactive };
  },

  data: () => {
    return {
      colorOptions: ["blue", "amber", "red", "green"],
      iconOptions: [
        "icon-exclamation-mark",
        "icon-question-mark",
        "icon-alarm",
        "icon-check",
        "icon-light-bulb"
      ]
    };
  }
});
</script>
