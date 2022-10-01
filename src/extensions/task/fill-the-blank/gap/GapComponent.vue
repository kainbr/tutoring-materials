<template>
  <node-view-wrapper class="inline">
    <Popover v-if="editor.isEditable" class="w-fit inline-block">
      <PopoverButton
        class="cursor-pointer border border-blue-700 rounded-lg bg-white py-0 px-2 text-left shadow-md"
        @click="isModalOpen = true"
      >
        <LabelComponent
          :label="{
            message: 'editor.task.fill-the-blank.label-edit-options',
            hexIcon: getHexIconLabel(),
          }"
        />
      </PopoverButton>

      <PopoverPanel
        class="absolute z-50 mt-1 max-h-60 w-fit overflow-auto rounded-md bg-white p-0 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div v-for="(option, index) in node.attrs.options" :key="option.id">
          <div class="flex flex-row text-gray-900 select-none p-1 gap-2 mx-1">
            <input
              type="checkbox"
              :checked="isAnswerOptionChecked(option.id)"
              :disabled="isAnswerOptionDisabled(option.id)"
              @click="toggleSelectOptionEvaluation(option.id)"
            />

            <input
              type="text"
              placeholder="Option Text"
              :value="option.text"
              @input="updateSelectOptionText(option.id, $event)"
            />
            <div class="flex flex-row gap-0.5">
              <EditorMenuButton :disabled="index === 0" @click="moveUpOption(index, option.id)">
                <IconArrowUp />
              </EditorMenuButton>
              <EditorMenuButton
                :disabled="!node.attrs.options || index === node.attrs.options.length - 1"
                @click="moveDownOption(index, option.id)"
              >
                <IconArrowDown />
              </EditorMenuButton>
              <EditorMenuButton
                :disabled="node.attrs.options.length <= 1"
                @click="removeSelectOption(option.id)"
              >
                <IconTrash />
              </EditorMenuButton>
            </div>
          </div>
        </div>
        <div class="flex w-full items-center justify-center p-1">
          <button class="mx-4" @click="addSelectOption">+ Add option</button>
        </div>
      </PopoverPanel>
    </Popover>
    <Listbox
      v-else
      :model-value="state?.answer?.find((a) => a.id === node.attrs.id)?.value"
      @update:model-value="updateAnswer"
    >
      <div class="relative w-fit inline-block">
        <ListboxButton
          class="relative border border-blue-700 rounded-lg bg-white py-0 pl-2 pr-8 text-left shadow-md"
          :class="{
            'border border-green-700 bg-green-100': isCorrectAnswerOption(
              state.answer.find((a) => a.id === node.attrs.id)?.value
            ),
            'border border-red-700 bg-red-100': isIncorrectAnswerOption(
              state.answer.find((a) => a.id === node.attrs.id)?.value
            ),
          }"
        >
          <span class="block truncate">{{ selectedValue }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <IconDropDown class="h-4 w-4 text-gray-400" aria-hidden="true" />
          </span>
        </ListboxButton>
        <ListboxOptions
          class="absolute z-50 mt-2 max-h-60 min-w-full w-fit overflow-auto rounded-md bg-white p-0 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="(option, index) in node.attrs.options"
            v-slot="{ active, selected }"
            :key="option.id"
            :value="option.id"
            :disabled="['correct', 'final-incorrect'].includes(state.state)"
            as="template"
          >
            <div
              :class="[
                active && ['init', 'incorrect'].includes(state?.state)
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-900',
                selected && ['init', 'incorrect'].includes(state?.state)
                  ? 'bg-amber-100 text-amber-900'
                  : '',
                'relative cursor-pointer select-none p-2',
                isCorrectAnswerOption(option.id) ? 'bg-green-100' : '',
                isIncorrectAnswerOption(option.id) ? 'bg-red-100' : '',
              ]"
            >
              <span :class="['block truncate']">
                {{ option.text || "(" + (index + 1) + ")" }}
              </span>
            </div>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  </node-view-wrapper>
</template>

<script lang="ts">
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import LabelComponent from "@/helpers/LabelComponent.vue";
import { calculateHexIcon } from "@/helpers/util";
import { computed, defineComponent, inject, ref } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import {
  PopoverPanel,
  Popover,
  PopoverButton,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { v4 as uuid } from "uuid";

import type { PropType, Ref } from "vue";
import type { NodeViewProps } from "@tiptap/core";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import type { FTBEvaluation, FTBOptions, FTBState } from "@/extensions/task/fill-the-blank/types";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";

export default defineComponent({
  components: {
    EditorMenuButton,
    IconTrash,
    LabelComponent,
    NodeViewWrapper,
    Popover,
    PopoverButton,
    PopoverPanel,
    IconArrowDown,
    IconArrowUp,
    IconDropDown,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  },

  props: {
    editor: { type: Object as PropType<NodeViewProps["editor"]>, required: true },
    node: { type: Object as PropType<NodeViewProps["node"]>, required: true },
    decorations: { type: Object as PropType<NodeViewProps["decorations"]>, required: true },
    extension: { type: Object as PropType<NodeViewProps["extension"]>, required: true },
    getPos: { type: Function as PropType<NodeViewProps["getPos"]>, required: true },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true,
    },
    deleteNode: { type: Function as PropType<NodeViewProps["deleteNode"]>, required: true },
  },

  setup(props) {
    const isListboxOpen = ref(false);
    const isModalOpen = ref(true);

    const { options } = inject("options") as {
      options: Ref<FTBOptions>;
    };

    const { evaluation, updateEvaluation } = inject("evaluation") as {
      evaluation: Ref<FTBEvaluation>;
      updateEvaluation: (attributes: Partial<FTBEvaluation>) => void;
    };

    const { state, updateState } = inject("state") as {
      state: Ref<FTBState>;
      updateState: (attributes: Partial<FTBState>) => void;
    };

    const getHexIconLabel = () => {
      return calculateHexIcon(props.node.attrs.id);
    };

    const addSelectOption = () => {
      props.updateAttributes({ options: [...props.node.attrs.options, { id: uuid(), text: "" }] });
    };

    const updateSelectOptionText = (optionId: string, event: Event) => {
      const text = (event.target as HTMLInputElement).value;
      props.updateAttributes({
        options: props.node.attrs.options.map((o: { id: string; text: string }) => {
          return o.id === optionId ? { ...o, text } : o;
        }),
      });
    };

    const moveUpOption = (index: number, optionId: string) => {
      const option = props.node.attrs.options.find((o: { id: string }) => o.id === optionId);
      const options = props.node.attrs.options;
      options.splice(index - 1, 0, option);
      options.splice(index + 1, 1);
      props.updateAttributes({ options });
    };

    const moveDownOption = (index: number, optionId: string) => {
      const option = props.node.attrs.options.find((o: { id: string }) => o.id === optionId);
      const options = props.node.attrs.options;
      options.splice(index + 2, 0, option);
      options.splice(index, 1);
      props.updateAttributes({ options });
    };

    const removeSelectOption = (optionId: string) => {
      props.updateAttributes({
        options: props.node.attrs.options.filter(
          (o: { id: string; text: string }) => o.id !== optionId
        ),
      });
    };

    const toggleSelectOptionEvaluation = (optionId: string) => {
      const solution = evaluation.value.solution.map((gap) => {
        if (gap.id === props.node.attrs.id) {
          gap.options = gap.options.map((o) => {
            if (o.id === optionId) {
              o.value = !o.value;
            }
            return o;
          });
        }
        return gap;
      });
      updateEvaluation({ solution });
    };

    const updateAnswer = (optionId: string) => {
      updateState({
        answer: state.value.answer.map((a) => {
          if (a.id === props.node.attrs.id) {
            return { ...a, value: optionId };
          } else {
            return a;
          }
        }),
      });
    };

    const selectedValue = computed(() => {
      const selectedOption = props.node.attrs.options.find(
        (o: { id: string }) =>
          o.id === state.value.answer?.find((a) => a.id === props.node.attrs.id)?.value
      );

      if (!selectedOption) {
        return options.value.textSelectGapPlaceholder;
      } else if (!selectedOption.text) {
        return "...";
      } else {
        return selectedOption.text;
      }
    });

    const isCorrectAnswerOption = (id: string | null | undefined) => {
      if (!id) return false;
      if (!!state.value.state && ["correct", "final-incorrect"].includes(state.value.state)) {
        return !!evaluation.value.solution
          .find((s) => s.id === props.node.attrs.id)
          ?.options.find((o) => o.id === id)?.value;
      } else {
        return false;
      }
    };

    const isIncorrectAnswerOption = (id: string | null | undefined) => {
      if (!id) return false;
      if (!!state.value.state && ["correct", "final-incorrect"].includes(state.value.state)) {
        return !evaluation.value.solution
          .find((s) => s.id === props.node.attrs.id)
          ?.options.find((o) => o.id === id)?.value;
      } else {
        return false;
      }
    };

    const isAnswerOptionChecked = (id: string) => {
      return !!evaluation.value.solution
        .find((s) => s.id === props.node.attrs.id)
        ?.options.find((o) => o.id === id)?.value;
    };

    const isAnswerOptionDisabled = (id: string) => {
      return (
        props.node.attrs.options.length === 1 ||
        (!!evaluation.value.solution
          .find((s) => s.id === props.node.attrs.id)
          ?.options.find((o) => o.id === id)?.value &&
          evaluation.value.solution
            .find((s) => s.id === props.node.attrs.id)
            ?.options.filter((o) => o.value).length === 1)
      );
    };

    return {
      evaluation,
      isListboxOpen,
      isModalOpen,
      options,
      selectedValue,
      state,
      addSelectOption,
      getHexIconLabel,
      isAnswerOptionChecked,
      isAnswerOptionDisabled,
      isCorrectAnswerOption,
      isIncorrectAnswerOption,
      moveDownOption,
      moveUpOption,
      removeSelectOption,
      toggleSelectOptionEvaluation,
      updateAnswer,
      updateEvaluation,
      updateSelectOptionText,
    };
  },
});
</script>
