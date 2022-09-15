<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-if="width <= 500">
        <div v-for="index in state?.order" :key="index" class="flex flex-col mt-1">
          <InlineEditor :content="!!content ? content[index].content : undefined" />
          <div
            class="flex flex-row w-full gap-2"
            :class="[showCorrectnessAnswerOption(content[index])]"
          >
            <div
              class="flex basis-1/2 items-center gap-2 justify-end cursor-default"
              @click="updateAnswerOptionValue(content[index], false)"
            >
              {{ options.falseLabel }}
              <input
                type="radio"
                :checked="
                  state.answer.find((s) => s.id === content[index].id)?.value === false || false
                "
                :disabled="['correct', 'final-incorrect'].includes(state.state)"
              />
            </div>
            <div
              class="flex basis-1/2 items-center gap-2 justify-start cursor-default"
              @click="updateAnswerOptionValue(content[index], true)"
            >
              <input
                type="radio"
                :checked="
                  state.answer.find((s) => s.id === content[index].id)?.value === true || false
                "
                :disabled="['correct', 'final-incorrect'].includes(state.state)"
              />
              {{ options.trueLabel }}
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="flex flex-row grid grid-cols-8 w-full gap-2">
          <div class="col-span-1 flex justify-center">{{ options.falseLabel }}</div>
          <div class="col-span-1 flex justify-center">{{ options.trueLabel }}</div>
        </div>
        <div
          v-for="index in state?.order"
          :key="index"
          class="flex flex-row grid grid-cols-8 w-full gap-2"
        >
          <div class="col-span-1 flex justify-center">
            <input type="radio" class="h-fit m-2" />
          </div>
          <div class="col-span-1 flex justify-center">
            <input type="radio" class="h-fit m-2" />
          </div>
          <div class="col-span-6">
            <InlineEditor :content="!!content ? content[index].content : undefined" />
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div v-for="(option, index) in content" :key="option.id" class="flex flex-row gap-2">
        <div class="flex flex-row min-w-fit">
          <span class="px-2 mt-0.5 w-10 min-w-fit"> ({{ index + 1 }}) </span>
          <input
            :checked="evaluation.solution.find((s) => s.id === option.id)?.value === false || false"
            type="radio"
            class="mx-1 h-fit my-2.5"
            @input="updateEvaluationOptionValue(option, false)"
          />
          <input
            :checked="evaluation.solution.find((s) => s.id === option.id)?.value === true || false"
            type="radio"
            class="mx-1 h-fit my-2.5"
            @input="updateEvaluationOptionValue(option, true)"
          />
        </div>

        <div class="grow [&_p]:my-1">
          <InlineEditor
            is-editor
            :content="option.content"
            @update:content="updateAnswerOptionContent(option, content, $event, update)"
          />
        </div>

        <div class="min-w-fit">
          <EditorMenuButton
            :disabled="index === 0"
            tabindex="-1"
            @click="moveUpOption(index, option, content, update)"
          >
            <IconArrowUp />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content || index === content.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option, content, update)"
          >
            <IconArrowDown />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content || content.length <= 1"
            tabindex="-1"
            @click="removeOption(index, content, update)"
          >
            <IconTrash />
          </EditorMenuButton>
        </div>
      </div>

      <!-- Bottom menu pane -->
      <div>
        <div class="flex flex-row justify-between">
          <div class="flex flex-col grow gap-1">
            <div class="flex flex-row">
              <div class="basis-1/3">
                <label>{{ $t("editor.task.true-false.label-false") }} </label>
              </div>
              <input
                type="text"
                class="text-sm p-1"
                :value="options.trueLabel"
                @input="updateTrueLabel"
              />
            </div>
            <div class="flex flex-row">
              <div class="basis-1/3">
                <label>{{ $t("editor.task.true-false.label-true") }} </label>
              </div>
              <input
                type="text"
                class="text-sm p-1"
                :value="options.falseLabel"
                @input="updateFalseLabel"
              />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <EditorMenuButton
                :active="options?.shuffle"
                :on-active-click="() => update({ options: { ...options, shuffle: false } })"
                :on-inactive-click="() => update({ options: { ...options, shuffle: true } })"
              >
                <IconShuffle />
              </EditorMenuButton>
              <EditorMenuButton @click="addOption(content, update)">
                <IconAdd />
              </EditorMenuButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Evaluation -->
    <template #evaluation>
      <!--suppress JSUnresolvedFunction -->
      <OptionsFormEnum
        v-if="!!evaluation"
        name="evaluationName"
        :value="evaluation.name"
        :options="
          evaluationOptions.map((o) => {
            return { value: o.name, label: o.label };
          })
        "
        :label="$t('editor.task.evaluation-label-type')"
        @update:value="updateEvaluationName"
      />
    </template>

    <!-- Options -->
    <template #options>
      <div v-if="options" class="mt-1 flex flex-col gap-2">
        <OptionsDefaults
          :options="options"
          has-submit-button
          has-correct-state
          has-incorrect-state
          has-final-incorrect-state
          @update:options="update({ options: $event })"
        />
      </div>
    </template>
  </TaskScaffold>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { formatOptions } from "@/extensions/task/true-false/format/options";
import { formatContent } from "@/extensions/task/true-false/format/content";
import { formatEvaluation } from "@/extensions/task/true-false/format/evaluation";
import { formatState } from "@/extensions/task/true-false/format/state";
import { useTask } from "@/extensions/task/helpers";
import { useListOptions } from "@/extensions/task/helpers/listOptions";
import { evaluationOptions } from "@/extensions/task/true-false/format/evaluation";
import { isEqual } from "lodash-es";
import { calculateHexIcon } from "@/helpers/util";
import { formatEvents } from "@/extensions/task/true-false/format/events";

import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconShuffle from "@/helpers/icons/IconShuffle.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import OptionsDefaults from "@/extensions/task/helpers/OptionsDefaults.vue";
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";
import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import type { PropType } from "vue";
import type {
  TFOption,
  TFEvaluation,
  TFOptions,
  TFState,
  TFProps,
  TFEmits,
} from "@/extensions/task/true-false/types";
import type { Editor } from "@tiptap/vue-3";
import type { InjectedContainerDimensions } from "@/helpers/useContainerDimensions";
import type { MCOption } from "@/extensions/task/multiple-choice/types";
import type { InjectedEventBus } from "@/helpers/useEventBus";

export default defineComponent({
  name: "TaskTrueFalse",

  components: {
    EditorMenuButton,
    InlineEditor,
    TaskScaffold,
    IconAdd,
    IconArrowDown,
    IconArrowUp,
    IconShuffle,
    IconTrash,
    OptionsDefaults,
    OptionsFormEnum,
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
      type: Object as PropType<TFOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<TFOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<TFEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<TFState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { width } = inject("containerDimensions") as InjectedContainerDimensions;
    const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<TFProps, TFEmits, TFOptions, TFOption[], TFEvaluation, TFState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const { addOption, removeOption, moveUpOption, moveDownOption, updateAnswerOptionContent } =
      useListOptions<TFOption>();

    const updateEvaluationName = (newName: string) => {
      switch (newName) {
        case "all-match":
        default:
          update({
            evaluation: {
              name: newName,
              solution:
                !!props.evaluation && !!props.evaluation.solution ? props.evaluation.solution : [],
            },
          });
      }
    };

    const updateEvaluationOptionValue = (option: TFOption, value: boolean) => {
      if (!!props.evaluation && Array.isArray(props.evaluation.solution)) {
        const newSolution = props.evaluation.solution.map((s) => {
          return s.id === option.id ? { ...s, value: value } : s;
        });
        update({ evaluation: { ...props.evaluation, solution: newSolution } });
      }
    };

    const updateAnswerOptionValue = (option: MCOption, value: boolean) => {
      if (
        Array.isArray(props.content) &&
        !!props.state &&
        !["correct", "final-incorrect"].includes(props.state.state)
      ) {
        const oldAnswer = props.state?.answer;
        const newAnswer = oldAnswer.map((s) => {
          return s.id === option.id ? { ...s, value: value } : s;
        });

        if (!isEqual(oldAnswer, newAnswer)) {
          update({
            state: {
              ...props.state,
              answer: newAnswer,
            },
          });

          eventBus.emit("interaction", {
            type: "answer-changed",
            parent: props.id,
            facts: {},
            label: {
              message: "global.event.type-answer-changed",
              hexIcon: calculateHexIcon(props.id),
            },
            data: {
              ...props.state,
              answer: newAnswer,
              oldAnswer: oldAnswer,
            },
          });
        }
      }
    };

    const showCorrectnessAnswerOption = (option: TFOption) => {
      const state = props.state?.state;
      const answer = props.state?.answer.find((a) => a.id === option.id)?.value;
      const solution = props.evaluation?.solution.find((s) => s.id === option.id)?.value;

      if (!!state && ["correct", "final-incorrect"].includes(state)) {
        return answer === solution ? "bg-green-50" : "bg-red-50";
      } else {
        return "";
      }
    };

    const updateTrueLabel = ($event: Event) => {
      update({
        options: { ...props.options, trueLabel: ($event.target as HTMLInputElement).value },
      });
    };

    const updateFalseLabel = ($event: Event) => {
      update({
        options: { ...props.options, falseLabel: ($event.target as HTMLInputElement).value },
      });
    };

    return {
      addOption,
      evaluationOptions,
      moveUpOption,
      moveDownOption,
      removeOption,
      showCorrectnessAnswerOption,
      update,
      updateAnswerOptionContent,
      updateAnswerOptionValue,
      updateEvaluationName,
      updateEvaluationOptionValue,
      updateFalseLabel,
      updateTrueLabel,
      width,
    };
  },
});
</script>
