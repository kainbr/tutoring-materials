<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-for="index in state?.order" :key="index" class="gap-2 items-center cursor-default">
        <div
          class="flex flex-row pl-2"
          :class="{
            'bg-green-50': !!content ? showCorrectAnswerOption(content[index]) : false,
            'bg-red-50': !!content ? showIncorrectAnswerOption(content[index]) : false,
          }"
          @click="!!content ? changeAnswerOptionValue(content[index]) : () => {}"
        >
          <input
            type="radio"
            class="mr-2"
            :checked="!!content ? isOptionChecked(content[index]) : false"
          />
          <div style="flex-grow: 1" class="py-1">
            <InlineEditor :content="!!content ? content[index].content : undefined" />
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div
        v-for="(option, index) in content"
        :key="option.id"
        class="flex flex-row gap-2 items-center"
      >
        <div>
          <span class="px-1"> ({{ index + 1 }}) </span>
          <input
            :checked="evaluation?.solution.find((s) => s.id === option.id)?.value || false"
            type="radio"
            @input="updateAnswerOptionValue(option)"
          />
        </div>

        <div class="grow [&_p]:my-1">
          <InlineEditor
            is-editor
            :content="option.content"
            @update:content="updateAnswerOptionContent(option, $event)"
          />
        </div>

        <div>
          <EditorMenuButton
            :disabled="index === 0"
            tabindex="-1"
            @click="moveUpOption(index, option)"
          >
            <IconArrowUp />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content || index === content.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option)"
          >
            <IconArrowDown />
          </EditorMenuButton>
          <EditorMenuButton tabindex="-1" @click="addFeedbackHint(option.id)">
            <IconFeedback />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content || content.length <= 1"
            tabindex="-1"
            @click="removeOption(index)"
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
            <EditorMenuButton @click="addOption">
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
        :options="evaluationOptions.map((o) => o.name)"
        :label="$t('editor.task.evaluation-label-type')"
        @update:value="updateEvaluationName"
      />
    </template>

    <!-- Options -->
    <template #options>
      <div v-if="options" class="mt-1 flex flex-col gap-2">
        <OptionsDefaults
          :options="options"
          allow-empty-answer-submission
          has-max-attempts
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
import { defineComponent } from "vue";

import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import IconFeedback from "@/helpers/icons/IconFeedback.vue";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconShuffle from "@/helpers/icons/IconShuffle.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import TaskScaffold from "@/extensions/task/base/TaskScaffold.vue";
import OptionsDefaults from "@/helpers/tasks/OptionsDefaults.vue";
import OptionsFormEnum from "@/helpers/tasks/OptionsFormEnum.vue";

import { calculateHexIcon } from "@/helpers/util";
import { formatOptions } from "@/extensions/task/single-choice/format/options";
import { formatContent } from "@/extensions/task/single-choice/format/content";
import { formatState } from "@/extensions/task/single-choice/format/state";
import { formatEvents } from "@/extensions/task/single-choice/format/events";
import {
  formatEvaluation,
  evaluationOptions,
} from "@/extensions/task/single-choice/format/evaluation";
import { useTask } from "@/extensions/task/helpers";
import { v4 as uuid } from "uuid";

// Types
import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";
import type {
  SCOption,
  SCEvaluation,
  SCOptions,
  SCState,
  SCProps,
  SCEmits,
} from "@/extensions/task/single-choice/types";
import { isEqual } from "lodash-es";
import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";

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
      type: Object as PropType<SCOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Array as PropType<SCOption[]>,
      default() {
        return [];
      },
    },
    evaluation: {
      type: Object as PropType<SCEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<SCState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { update } = useTask<SCProps, SCEmits, SCOptions, SCOption[], SCEvaluation, SCState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const addOption = () => {
      if (Array.isArray(props.content)) {
        const contentCopy = props.content;
        contentCopy.push({
          id: uuid(),
          content: { type: "doc", content: [{ type: "paragraph" }] },
        });
        update({ content: contentCopy });
      }
    };

    const removeOption = (index: number) => {
      if (Array.isArray(props.content)) {
        if (props.content.length > 1) {
          const contentCopy = props.content;
          contentCopy.splice(index, 1);
          update({ content: contentCopy });
        }
      }
    };

    const moveUpOption = (index: number, option: SCOption) => {
      if (Array.isArray(props.content)) {
        const contentCopy = props.content;
        contentCopy.splice(index - 1, 0, option);
        contentCopy.splice(index + 1, 1);
        update({ content: contentCopy });
      }
    };

    const moveDownOption = (index: number, option: SCOption) => {
      if (Array.isArray(props.content)) {
        const contentCopy = props.content;
        contentCopy.splice(index + 2, 0, option);
        contentCopy.splice(index, 1);
        update({ content: contentCopy });
      }
    };

    const updateAnswerOptionValue = (option: SCOption) => {
      if (!!props.evaluation && Array.isArray(props.evaluation.solution)) {
        const newSolution = props.evaluation.solution.map((s) => {
          return { ...s, value: s.id === option.id };
        });
        update({ evaluation: { ...props.evaluation, solution: newSolution } });
      }
    };

    const updateAnswerOptionContent = (option: SCOption, $event: JSONContent) => {
      if (Array.isArray(props.content)) {
        update({
          content: props.content.map((o) => (option?.id === o.id ? { ...o, content: $event } : o)),
        });
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
            value: o.id === option.id,
          };
        });

        if (!isEqual(oldAnswer, newAnswer)) {
          update({
            state: {
              ...props.state,
              answer: newAnswer,
            },
          });

          props.editor.storage.document.eventBus().emit("answer-changed", {
            parent: props.id,
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
          hexIcon: calculateHexIcon(uid),
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
                    text: "Hello world!",
                  },
                ],
              },
            ],
          },
        },
      };

      const trigger: EventTrigger = {
        id: uuid(),
        event: "answer-submitted",
        parent: props.id,
        rules: [
          {
            id: uuid(),
            fact: reference + "-correct",
            operation: "equal",
            value: false,
          },
        ],
        feedbacks: [uid],
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
                !!props.evaluation && !!props.evaluation.solution ? props.evaluation.solution : [],
            },
          });
      }
    };

    return {
      update,
      addOption,
      removeOption,
      moveUpOption,
      moveDownOption,
      updateAnswerOptionValue,
      updateAnswerOptionContent,
      changeAnswerOptionValue,
      showCorrectAnswerOption,
      showIncorrectAnswerOption,
      isOptionChecked,
      updateEvaluationName,
      evaluationOptions,
      addFeedbackHint,
    };
  },
});
</script>
