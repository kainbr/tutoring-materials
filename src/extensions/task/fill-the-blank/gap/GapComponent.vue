<template>
  <node-view-wrapper class="inline">
    <div v-if="editor.isEditable" class="w-fit inline-block">
      <tippy tag="button" trigger="click" theme="light-border" interactive>
        <template #default>
          <div
            class="cursor-pointer border border-blue-700 rounded-lg bg-white py-0 px-2 text-left shadow-md hover:bg-gray-50">
            <LabelComponent
              :label="{
            message: 'editor.task.fill-the-blank.label-edit-options',
            hexIcon: getHexIconLabel(),
          }"
            />
            {{ node.attrs.options.length }}
          </div>
        </template>
        <template #content>
          <div class="max-h-60 w-fit overflow-auto p-0 text-base">
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
          </div>
        </template>
      </tippy>
    </div>
    <div v-else class="w-fit inline-block">
      <tippy tag="button" trigger="click" theme="light-border" interactive>
        <template #default>
          <div
            class="inline-flex flex-row block border border-blue-700 rounded-lg bg-white py-0 px-2 text-left shadow-md"
            :class="{
            'hover:bg-gray-50': ['init', 'incorrect'].includes(state?.state),
            'border-2 border-green-700 bg-green-100':
              (['correct', 'final-incorrect'].includes(state.state) ||
                !!state.correctGaps?.includes(node.attrs.id)) &&
              isCorrectAnswerOption(state.answer.find((a) => a.id === node.attrs.id)?.value),
            'border-2 border-red-700 bg-red-100':
              (['correct', 'final-incorrect'].includes(state.state) ||
                !!state.correctGaps?.includes(node.attrs.id)) &&
              isIncorrectAnswerOption(state.answer.find((a) => a.id === node.attrs.id)?.value),
          }">
            <span class="block truncate">{{ selectedValue }}</span>
            <span class="pointer-events-none inset-y-0 right-0 flex items-center pl-1">
              <IconDropDown class="h-4 w-4 text-gray-400" aria-hidden="true" />
            </span>
          </div>
        </template>
        <template #content class="p-0">
          <div class="max-h-60 w-fit overflow-auto p-0 text-base">
            <div v-for="(option, index) in node.attrs.options" :key="option.id">
              <div
                :class="[
                !!state.correctGaps?.includes(node.attrs.id) &&
                ['init', 'incorrect'].includes(state?.state)
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-gray-900',
                'relative  select-none p-2',
                (['correct', 'final-incorrect'].includes(state.state) ||
                  !!state.correctGaps?.includes(node.attrs.id)) &&
                isCorrectAnswerOption(option.id)
                  ? 'bg-green-100'
                  : 'cursor-pointer',
                (['correct', 'final-incorrect'].includes(state.state) ||
                  !!state.correctGaps?.includes(node.attrs.id)) &&
                isIncorrectAnswerOption(option.id)
                  ? 'bg-red-100'
                  : 'cursor-pointer',
              ]"
                @click="['init', 'incorrect'].includes(state?.state) ? updateAnswer(option.id) : ''">
                <span class="block truncate"
                      :class="{'font-semibold': state.answer.find((a) => a.id === node.attrs.id)?.value  === option.id,
                      'hover:font-semibold': ['init', 'incorrect'].includes(state?.state) }">
                  {{ option.text || "(" + (index + 1) + ")" }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </tippy>
    </div>
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
  ListboxOptions
} from "@headlessui/vue";
import { v4 as uuid } from "uuid";
import { Tippy } from "vue-tippy";

import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import type { PropType, Ref } from "vue";
import type { NodeViewProps } from "@tiptap/core";
import type { FTBEvaluation, FTBOptions, FTBState } from "@/extensions/task/fill-the-blank/types";
import type { InjectedAnswer } from "@/extensions/task/fill-the-blank/TaskComponent.vue";

export default defineComponent({
  components: {
    Tippy,
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
    ListboxOptions
  },

  props: {
    editor: { type: Object as PropType<NodeViewProps["editor"]>, required: true },
    node: { type: Object as PropType<NodeViewProps["node"]>, required: true },
    decorations: { type: Object as PropType<NodeViewProps["decorations"]>, required: true },
    extension: { type: Object as PropType<NodeViewProps["extension"]>, required: true },
    getPos: { type: Function as PropType<NodeViewProps["getPos"]>, required: true },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true
    },
    deleteNode: { type: Function as PropType<NodeViewProps["deleteNode"]>, required: true }
  },

  setup(props) {
    const { emitAnswerChangedEvent } = inject("answer") as InjectedAnswer;

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
        })
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
        )
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
      const oldAnswer = props.node.attrs.state?.answer;
      const newAnswer = state.value.answer.map((a) => {
        if (a.id === props.node.attrs.id) {
          return { ...a, value: optionId };
        } else {
          return a;
        }
      });

      updateState({
        answer: newAnswer
      });

      emitAnswerChangedEvent(newAnswer, oldAnswer);
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

      if (!!state.value.state) {
        return !!evaluation.value.solution
          .find((s) => s.id === props.node.attrs.id)
          ?.options.find((o) => o.id === id)?.value;
      }
    };

    const isIncorrectAnswerOption = (id: string | null | undefined) => {
      if (!id) return false;

      if (!!state.value.state) {
        return !evaluation.value.solution
          .find((s) => s.id === props.node.attrs.id)
          ?.options.find((o) => o.id === id)?.value;
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
      updateSelectOptionText
    };
  }
});
</script>
