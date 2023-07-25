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
          @click="changeAnswerOptionValue(content[index])"
        >
          <div class="flex justify-items-start">
          <input
            type="radio"
            class="m-2 enabled:cursor-pointer"
            :checked="isOptionChecked(content[index])"
            :disabled="['correct', 'final-incorrect'].includes(state.state)"
          />
          </div>
          <div style="flex-grow: 1" class="py-1"
               :class="{'cursor-pointer':!['correct', 'final-incorrect'].includes(state.state)}">
            <InlineEditor :content="!!content ? content[index].content : undefined" />
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div v-for="(option, index) in content" :key="option.id" class="flex flex-row gap-2">
        <div class="flex flex-row min-w-fit">
          <span class="w-10 min-w-fit text-right"> {{ index + 1 }}. </span>
        </div>

        <input
          :checked="evaluation.solution.find((s) => s.id === option.id)?.value || false"
          class="mx-1 my-2 h-fit"
          type="radio"
          @input="updateAnswerOptionValue(option)"
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
        <OptionsDefaults
          :options="options"
          allow-empty-answer-submission
          has-max-attempts
          has-disabled-check-timer
          has-disabled-next-timer
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
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";

import { calculateHexIcon } from "@/helpers/util";
import { formatOptions } from "@/extensions/task/single-choice/format/options";
import { formatContent } from "@/extensions/task/single-choice/format/content";
import { formatState } from "@/extensions/task/single-choice/format/state";
import { formatEvents } from "@/extensions/task/single-choice/format/events";
import {
  formatEvaluation,
  evaluationOptions
} from "@/extensions/task/single-choice/format/evaluation";
import { isEqual } from "lodash-es";
import { useTask } from "@/extensions/task/helpers";
import { v4 as uuid } from "uuid";

import type { PropType } from "vue";
import type {
  SCOption,
  SCEvaluation,
  SCOptions,
  SCState,
  SCProps,
  SCEmits
} from "@/extensions/task/single-choice/types";
import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { InjectedEventBus } from "@/helpers/useEventBus";
import { useListOptions } from "@/extensions/task/helpers/listOptions";

export default defineComponent({
  name: "TaskSingleChoice",

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
      type: Object as PropType<SCOptions>,
      default() {
        return {};
      }
    },
    content: {
      type: Array as PropType<SCOption[]>,
      default() {
        return [];
      }
    },
    evaluation: {
      type: Object as PropType<SCEvaluation>,
      default() {
        return {};
      }
    },
    state: {
      type: Object as PropType<SCState>,
      default() {
        return {};
      }
    }
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<SCProps, SCEmits, SCOptions, SCOption[], SCEvaluation, SCState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const { addOption, removeOption, moveUpOption, moveDownOption, updateAnswerOptionContent } =
      useListOptions<SCOption>();

    const updateAnswerOptionValue = (option: SCOption) => {
      if (!!props.evaluation && Array.isArray(props.evaluation.solution)) {
        const newSolution = props.evaluation.solution.map((s) => {
          return { ...s, value: s.id === option.id };
        });
        update({ evaluation: { ...props.evaluation, solution: newSolution } });
      }
    };

    const changeAnswerOptionValue = (option: SCOption) => {
      if (
        Array.isArray(props.content) &&
        !!props.state &&
        !["correct", "final-incorrect"].includes(props.state.state)
      ) {
        const oldAnswer = props.state?.answer;
        const newAnswer = props.content.map((o: SCOption) => {
          return {
            id: o.id,
            value: o.id === option.id
          };
        });

        if (!isEqual(oldAnswer, newAnswer)) {
          update({
            state: {
              ...props.state,
              answer: newAnswer
            }
          });

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

    const showCorrectAnswerOption = (option: SCOption) => {
      const state = props.state?.state;

      if (!!option.id && !!state && ["correct", "final-incorrect"].includes(state)) {
        return !!props.evaluation?.solution.find((s) => s.id === option.id)?.value;
      } else {
        return false;
      }
    };

    const showIncorrectAnswerOption = (option: SCOption) => {
      const state = props.state?.state;

      if (!!option.id && !!state && ["correct", "final-incorrect"].includes(state)) {
        return !props.evaluation?.solution.find((s) => s.id === option.id)?.value;
      } else {
        return false;
      }
    };

    const isOptionChecked = (option: SCOption) => {
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

    return {
      addFeedbackHint,
      addOption,
      changeAnswerOptionValue,
      evaluationOptions,
      isOptionChecked,
      moveUpOption,
      moveDownOption,
      removeOption,
      showCorrectAnswerOption,
      showIncorrectAnswerOption,
      update,
      updateAnswerOptionContent,
      updateAnswerOptionValue,
      updateEvaluationName
    };
  }
});
</script>
