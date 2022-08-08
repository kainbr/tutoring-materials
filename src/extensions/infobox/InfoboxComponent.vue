<template>
  <node-view-wrapper
    v-if="fontColor && backgroundColor && icon"
    :class="[editor.isEditable ? 'py-2' : '']"
    :style="'background-color: ' + backgroundColor + '; border-color: ' + fontColor"
    class="flex w-full border rounded-md px-4 mb-4"
  >
    <div class="flex flex-col w-full">
      <!-- Configuration menu -->
      <div
        v-if="editor.isEditable"
        class="flex flex-row items-center pb-2 mb-2 border-b-2 border-slate-300"
        contenteditable="false"
        data-drag-handle
        draggable="true"
      >
        <div class="flex flex-row grow items-center justify-center gap-4">
          <!-- Icon -->
          <div class="flex flex-row items-center">
            <span class="text-sm"> {{ $t("editor:infobox:icon-description") }}: </span>
            <Listbox :model-value="node.attrs.icon" class="ml-2 w-56">
              <div class="relative">
                <ListboxButton
                  class="relative w-full rounded-lg bg-white py-1.5 pl-2.5 pr-8 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate">
                    {{
                      $t(
                        "editor:infobox:icon-label-" +
                          iconOptions.find((option) => option === node.attrs.icon)
                      )
                    }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"
                      />
                    </svg>
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
                      :key="option"
                      v-slot="{ active, selectedOption }"
                      :value="option"
                      as="template"
                      class="cursor-pointer"
                      @click="updateAttributes({ icon: option })"
                    >
                      <li
                        :class="[
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          'relative py-2 my-0 pl-10 pr-4',
                        ]"
                      >
                        <span
                          :class="[
                            selectedOption ? 'font-medium' : 'font-normal',
                            'block truncate',
                          ]"
                        >
                          {{ $t("editor:infobox:icon-label-" + option) }}
                        </span>
                        <span
                          v-if="selectedOption"
                          class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                        >
                          <svg
                            class="h-5 w-5"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            />
                          </svg>
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
            <span class="text-sm"> {{ $t("editor:infobox:color-description") }}: </span>
            <Listbox :model-value="node.attrs.color" class="ml-2 w-32">
              <div class="relative">
                <ListboxButton
                  class="relative w-full rounded-lg bg-white py-1.5 pl-2.5 pr-8 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate">
                    {{
                      $t(
                        "editor:infobox:color-label-" +
                          colorOptions.find((option) => option === node.attrs.color)
                      )
                    }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"
                      />
                    </svg>
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
                      v-slot="{ active, selectedOption }"
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
                        <span
                          :class="[
                            selectedOption ? 'font-medium' : 'font-normal',
                            'block truncate',
                          ]"
                        >
                          {{ $t("editor:infobox:color-label-" + option) }}
                        </span>
                        <span
                          v-if="selectedOption"
                          class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                        >
                          <svg
                            class="h-5 w-5"
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                            />
                          </svg>
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
          <svg
            class="cursor-pointer"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            @click="deleteNode()"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex flex-row w-full [&_p]:mt-4">
        <!-- Icon -->
        <!-- eslint-disable vue/no-v-html -->
        <p class="w-[10%] min-w-[24px] max-w-[48px]" v-html="icon"></p>
        <!--eslint-enable-->

        <!-- Text -->
        <div class="ml-3 w-[90%]">
          <div class="flex w-full h-full items-center">
            <node-view-content :class="['!text-[' + fontColor + ']']" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import type { PropType } from "vue";
import type { NodeViewProps } from "@tiptap/core";

export default defineComponent({
  components: {
    NodeViewWrapper,
    NodeViewContent,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },

  props: {
    editor: { type: Object as PropType<NodeViewProps["editor"]>, required: true },
    node: { type: Object as PropType<NodeViewProps["node"]>, required: true },
    decorations: { type: Object as PropType<NodeViewProps["decorations"]>, required: true },
    selected: { type: Boolean as PropType<NodeViewProps["selected"]>, required: true },
    extension: { type: Object as PropType<NodeViewProps["extension"]>, required: true },
    getPos: { type: Function as PropType<NodeViewProps["getPos"]>, required: true },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true,
    },
    deleteNode: { type: Function as PropType<NodeViewProps["deleteNode"]>, required: true },
  },

  data: () => {
    return {
      colorOptions: ["blue", "yellow", "red", "green"],
      iconOptions: [
        "error-warning-line",
        "error-warning-fill",
        "question-line",
        "question-fill",
        "rainbow-line",
      ],
    };
  },

  computed: {
    fontColor() {
      switch (this.node.attrs.color) {
        case "blue":
          return "#1D40AF";
        case "yellow":
          return "#A16207";
        case "red":
          return "#B91C1B";
        case "green":
        default:
          return "#16803C";
      }
    },
    backgroundColor() {
      switch (this.node.attrs.color) {
        case "blue":
          return "#DBE9FE";
        case "yellow":
          return "#FEFCE8";
        case "red":
          return "#FEF1F2";
        case "green":
        default:
          return "#DCFCE6";
      }
    },
    icon() {
      let path;

      switch (this.node.attrs.icon) {
        case "error-warning-line":
          path =
            "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z";
          break;
        case "error-warning-fill":
          path =
            "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z";
          break;
        case "question-line":
          path =
            "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1 1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355z";
          break;
        case "question-fill":
          path =
            "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.501 3.501 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2v-.645z";
          break;
        case "rainbow-line":
        default:
          path =
            "M12 4c6.075 0 11 4.925 11 11v5h-2v-5a9 9 0 0 0-8.735-8.996L12 6a9 9 0 0 0-8.996 8.735L3 15v5H1v-5C1 8.925 5.925 4 12 4zm0 4a7 7 0 0 1 7 7v5h-2v-5a5 5 0 0 0-4.783-4.995L12 10a5 5 0 0 0-4.995 4.783L7 15v5H5v-5a7 7 0 0 1 7-7zm0 4a3 3 0 0 1 3 3v5h-2v-5a1 1 0 0 0-.883-.993L12 14a1 1 0 0 0-.993.883L11 15v5H9v-5a3 3 0 0 1 3-3z";
      }

      return (
        "<svg class='w-full' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'> <path fill='none' d='M0 0h24v24H0z' /> <path fill='" +
        this.fontColor +
        "' d='" +
        path +
        "' /></svg>"
      );
    },
  },
});
</script>
