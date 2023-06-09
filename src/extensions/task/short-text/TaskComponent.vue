<template>
  <TaskScaffold :editor="editor" contenteditable="false">
    <!-- Render -->
    <template #render>
      <input :disabled="['correct', 'final-incorrect'].includes(state.state)" :value="state.answer"
             class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
               placeholder:text-gray-400 focus:ring-indigo-600 sm:text-sm sm:leading-6"
             name="answer"
             type="text"
             @input="changeAnswerValue"
      >
    </template>

    <!-- Content -->
    <!--
    <template #content>
    </template>
    -->

    <!-- Evaluation -->
    <template #evaluation>
      <!--suppress JSUnresolvedFunction -->
      <OptionsFormEnum
        v-if="!!evaluation"
        :label="$t('editor.task.evaluation-label-type')"
        :options="
          evaluationOptions.map((o) => {
            return { value: o.name, label: o.label };
          })
        "
        :value="evaluation.name"
        name="evaluationName"
        @update:value="updateEvaluationName"
      />
    </template>

    <!-- Options -->
    <template #options>
      <div v-if="options" class="mt-1 flex flex-col gap-2">
        <OptionsDefaults
          :options="options"
          allow-empty-answer-submission
          has-correct-state
          has-final-incorrect-state
          has-incorrect-state
          has-max-attempts
          has-submit-button
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
import { formatOptions } from "@/extensions/task/short-text/format/options";
import { formatContent } from "@/extensions/task/short-text/format/content";
import { formatState } from "@/extensions/task/short-text/format/state";
import { formatEvents } from "@/extensions/task/short-text/format/events";
import {
  formatEvaluation,
  evaluationOptions
} from "@/extensions/task/short-text/format/evaluation";
import { useTask } from "@/extensions/task/helpers";

import type { PropType } from "vue";
import type {
  STContent,
  STEvaluation,
  STOptions,
  STState,
  STProps,
  STEmits
} from "@/extensions/task/short-text/types";
import type { Editor } from "@tiptap/vue-3";
import type { InjectedEventBus } from "@/helpers/useEventBus";

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
      type: Object as PropType<STOptions>,
      default() {
        return {};
      }
    },
    content: {
      type: Object as PropType<STContent>,
      default() {
        return {};
      }
    },
    evaluation: {
      type: Object as PropType<STEvaluation>,
      default() {
        return {};
      }
    },
    state: {
      type: Object as PropType<STState>,
      default() {
        return {};
      }
    }
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<STProps, STEmits, STOptions, STContent, STEvaluation, STState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const changeAnswerValue = ($event: InputEvent) => {

      const oldAnswer = props.state?.answer;
      const newAnswer = ($event.target as HTMLInputElement)?.value;

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
      changeAnswerValue,
      evaluationOptions,
      update,
      updateEvaluationName
    };
  }
});
</script>
