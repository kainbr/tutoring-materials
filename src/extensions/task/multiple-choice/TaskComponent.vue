<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-for="index in state?.order" :key="index" class="gap-2 cursor-default">
        <div
          class="flex flex-row pl-2"
          :class="{
            'bg-green-50': showCorrectAnswerOption(content[index]),
            'bg-red-50': showIncorrectAnswerOption(content[index]),
          }"
          @click="toggleAnswerOptionValue(content[index])"
        >
          <input
            type="checkbox"
            class="mx-2 my-2.5 enabled:cursor-pointer"
            :checked="isOptionChecked(content[index])"
            :disabled="['correct', 'final-incorrect'].includes(state.state)"
          />
          <div style="flex-grow: 1"
               :class="{'cursor-pointer':!['correct', 'final-incorrect'].includes(state.state)}">
            <InlineEditor :content="!!content ? content[index].content : undefined" />
          </div>
        </div>
      </div>
      <span v-if="options?.showPartiallyCorrectCount && ['incorrect'].includes(state.state)"
            class="pl-3 text-sm text-slate-400">
        {{
          $t("editor.task.multiple-choice.label-partially-correct-count", {
            n: numberCorrectOptions,
            partiallyCorrect: numberCorrectlySelectedOptionsFromPreviousSubmit,
            partiallyIncorrect: numberIncorrectlySelectedOptionsFromPreviousSubmit
          })
        }}
      </span>
    </template>

    <!-- Content -->
    <template #content>
      <div v-for="(option, index) in content" :key="option.id" class="flex flex-row gap-2">
        <div class="flex flex-row min-w-fit">
          <span class="w-10 min-w-fit text-right"> {{ index + 1 }}. </span>
        </div>

        <input
          :checked="evaluation.solution.find((s) => s.id === option.id)?.value || false"
          class="mx-1 my-2"
          type="checkbox"
          @input="toggleEvaluationOptionValue(option)"
        />

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
          <EditorMenuButton tabindex="-1" @click="addFeedbackHint(option.id)">
            <IconFeedback />
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
        <div style="display: flex; flex-direction: row; justify-content: end">
          <div style="display: flex; gap: 1px">
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
      <div v-if="options" class="mt-1 flex flex-col gap-1.5">
        <OptionsFormBoolean
          v-if="options?.showPartiallyCorrectCount !== undefined"
          :label="$t('editor.task.multiple-choice.config-label-show-partially-correct-count')"
          :value="options.showPartiallyCorrectCount"
          name="showPartiallyCorrectCount"
          @update:value="update({ options: { ...options, showPartiallyCorrectCount: $event }})"
        ></OptionsFormBoolean>
        <OptionsDefaults
          :options="options"
          allow-empty-answer-submission
          has-max-attempts
          has-disabled-check-timer
          has-disabled-next-timer
          has-submit-button
          has-feedback-button
          has-next-button
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
import { computed, defineComponent, inject, nextTick } from "vue";

import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import IconFeedback from "@/helpers/icons/IconFeedback.vue";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconShuffle from "@/helpers/icons/IconShuffle.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";
import OptionsDefaults from "@/extensions/task/helpers/OptionsDefaults.vue";
import OptionsFormBoolean from "@/extensions/task/helpers/OptionsFormBoolean.vue";
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";

import { calculateHexIcon } from "@/helpers/util";
import { formatOptions } from "@/extensions/task/multiple-choice/format/options";
import { formatContent } from "@/extensions/task/multiple-choice/format/content";
import { formatState } from "@/extensions/task/multiple-choice/format/state";
import { formatEvents } from "@/extensions/task/multiple-choice/format/events";
import {
  formatEvaluation,
  evaluationOptions
} from "@/extensions/task/multiple-choice/format/evaluation";
import { isEqual } from "lodash-es";
import { useListOptions } from "@/extensions/task/helpers/listOptions";
import { useTask } from "@/extensions/task/helpers";
import { v4 as uuid } from "uuid";

import type { PropType } from "vue";
import type {
  MCOption,
  MCEvaluation,
  MCOptions,
  MCState,
  MCProps,
  MCEmits
} from "@/extensions/task/multiple-choice/types";
import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { InjectedEventBus } from "@/helpers/useEventBus";
import type { TaskState } from "@/extensions/task/types";
import type { InjectedSubmit } from "@/extensions/task/base/TaskComponent.vue";

export default defineComponent({
  name: "TaskMultipleChoice",

  components: {
    EditorMenuButton,
    IconAdd,
    IconFeedback,
    IconArrowDown,
    IconArrowUp,
    IconShuffle,
    IconTrash,
    InlineEditor,
    TaskScaffold,
    OptionsDefaults,
    OptionsFormBoolean,
    OptionsFormEnum
  },

  props: {
    id: {
      type: String,
      required: true
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    options: {
      type: Object as PropType<MCOptions>,
      default() {
        return {};
      }
    },
    content: {
      type: Array as PropType<MCOption[]>,
      default() {
        return [];
      }
    },
    evaluation: {
      type: Object as PropType<MCEvaluation>,
      default() {
        return {};
      }
    },
    state: {
      type: Object as PropType<MCState>,
      default() {
        return {};
      }
    }
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { eventBus } = inject("eventBus") as InjectedEventBus;
    const { submittedTaskStates } = inject("submit") as InjectedSubmit;

    const { update } = useTask<MCProps, MCEmits, MCOptions, MCOption[], MCEvaluation, MCState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const { addOption, removeOption, moveUpOption, moveDownOption, updateAnswerOptionContent } =
      useListOptions<MCOption>();

    const toggleEvaluationOptionValue = (option: MCOption) => {
      if (!!props.evaluation && Array.isArray(props.evaluation.solution)) {
        const newSolution = props.evaluation.solution.map((s) => {
          return s.id === option.id ? { ...s, value: !s.value } : s;
        });
        update({ evaluation: { ...props.evaluation, solution: newSolution } });
      }
    };

    const toggleAnswerOptionValue = async (option: MCOption) => {
      if (
        Array.isArray(props.content) &&
        !!props.state &&
        !["correct", "final-incorrect"].includes(props.state.state)
      ) {
        const oldAnswer = props.state?.answer;
        const newAnswer = oldAnswer.map((s) => {
          return s.id === option.id ? { ...s, value: !s.value } : s;
        });

        if (!isEqual(oldAnswer, newAnswer)) {
          update({
            state: {
              ...props.state,
              answer: newAnswer
            }
          });

          await nextTick();
          eventBus.emit("interaction", {
            type: "answer-changed",
            parent: props.id,
            facts: {},
            label: {
              message: "global.event.type-answer-changed",
              hexIcon: calculateHexIcon(props.id)
            },
            data: {
              ...props.state,
              answer: newAnswer,
              oldAnswer: oldAnswer
            }
          });
        }
      }
    };

    const showCorrectAnswerOption = (option: MCOption) => {
      const state = props.state?.state;

      if (!!option.id && !!state && ["correct", "final-incorrect"].includes(state)) {
        return !!props.evaluation?.solution.find((s) => s.id === option.id)?.value;
      } else {
        return false;
      }
    };

    const showIncorrectAnswerOption = (option: MCOption) => {
      const state = props.state?.state;

      if (!!option.id && !!state && ["correct", "final-incorrect"].includes(state)) {
        return !props.evaluation?.solution.find((s) => s.id === option.id)?.value;
      } else {
        return false;
      }
    };

    const isOptionChecked = (option: MCOption) => {
      const answers = props.state?.answer;

      if (!!answers) {
        return !!answers.find((o) => o.id === option.id)?.value;
      } else {
        return false;
      }
    };

    const addFeedbackHint = (reference: string) => {
      const uid = uuid();
      const hintFeedback: Feedback = {
        id: uid,
        parent: props.id,
        type: "feedback-hint",
        label: {
          message: "global.feedback.type-feedback-hint",
          hexIcon: calculateHexIcon(uid)
        },
        config: {
          reference: reference,
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Hello world!"
                  }
                ]
              }
            ]
          }
        }
      };

      const trigger: EventTrigger = {
        id: uuid(),
        event: "answer-submitted",
        parent: props.id,
        rules: [
          {
            id: uuid(),
            fact: reference + "-selected",
            operation: "equal",
            value: !props.evaluation.solution.find((option) => option.id === reference)?.value
          }
        ],
        feedbacks: [uid]
      };

      props.editor.chain().addFeedback(hintFeedback).addEventTrigger(trigger).run();
    };

    const updateEvaluationName = (newName: string) => {
      switch (newName) {
        case "all-match":
        default:
          update({
            evaluation: {
              name: newName,
              solution:
                !!props.evaluation && !!props.evaluation.solution ? props.evaluation.solution : []
            }
          });
      }
    };

    const numberCorrectOptions = computed(() => {
      return props.evaluation?.solution?.filter((s) => s.value).length;
    });

    const numberCorrectlySelectedOptionsFromPreviousSubmit = computed(() => {
      if (submittedTaskStates.value.length > 0) {
        const lastItem: TaskState = submittedTaskStates.value[submittedTaskStates.value.length - 1];
        return (lastItem as MCState).answer?.filter((a) => {
          return props.evaluation?.solution.find((s) => s.id === a.id)?.value && a.value;
        }).length;
      }
      return;
    });

    const numberIncorrectlySelectedOptionsFromPreviousSubmit = computed(() => {
      if (submittedTaskStates.value.length > 0) {
        const lastItem: TaskState = submittedTaskStates.value[submittedTaskStates.value.length - 1];
        return (lastItem as MCState).answer?.filter((a) => {
          return !props.evaluation?.solution.find((s) => s.id === a.id)?.value && a.value;
        }).length;
      }
      return;
    });

    return {
      addFeedbackHint,
      addOption,
      toggleAnswerOptionValue,
      evaluationOptions,
      isOptionChecked,
      moveUpOption,
      moveDownOption,
      numberCorrectOptions,
      numberCorrectlySelectedOptionsFromPreviousSubmit,
      numberIncorrectlySelectedOptionsFromPreviousSubmit,
      removeOption,
      showCorrectAnswerOption,
      showIncorrectAnswerOption,
      submittedTaskStates,
      update,
      updateAnswerOptionContent,
      toggleEvaluationOptionValue,
      updateEvaluationName
    };
  }
});
</script>
