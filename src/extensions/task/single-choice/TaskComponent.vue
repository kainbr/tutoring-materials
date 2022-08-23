<template>
  <TaskScaffold :is-editor="editor.isEditable" contenteditable="false" @submit="$emit('submit')">
    <!--
    Render
    -->
    <template #render>
      <div
        v-for="index in state?.order"
        :key="index"
        class="flex flex-row gap-2 pl-2 items-center cursor-default"
        :class="{
          'bg-red-50':
            ['correct', 'final-incorrect'].includes(state.state) &&
            evaluation.solution.find((s) => s.id === content[index].id).value === false,
          'bg-green-50':
            ['correct', 'final-incorrect'].includes(state.state) &&
            evaluation.solution.find((s) => s.id === content[index].id).value === true,
        }"
        @click="changeAnswerOptionValue(content[index])"
      >
        <input
          type="radio"
          :checked="state?.answer.find((o) => o.id === content[index].id)?.value || false"
        />
        <div style="flex-grow: 1" class="py-1">
          <InlineEditor :content="content[index].content" />
        </div>
      </div>
    </template>

    <!--
    Content
    -->
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
            :disabled="index === content.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option)"
          >
            <IconArrowDown />
          </EditorMenuButton>
          <ConfigurationButton
            :editor="editor"
            :parent="id"
            :reference="option.id"
            :create-feedback="(feedback) => createFeedback(feedback)"
            :update-feedback="(attributes) => updateFeedback(feedbacks.find((f: StoredFeedback) =>
                  f.type === 'feedback-hint' && f.config.reference === option.id), attributes)"
            :remove-feedback="() => removeFeedback(feedbacks.find((f: StoredFeedback) =>
                  f.type === 'feedback-hint' && f.config.reference === option.id))"
          />
          <EditorMenuButton
            :disabled="content.length <= 1"
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
              :on-active-click="() => updateOptions({ ...options, shuffle: false })"
              :on-inactive-click="() => updateOptions({ ...options, shuffle: true })"
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
        @update:value="updateEvaluation({ ...evaluation, name: $event })"
      />
    </template>

    <!-- Feedbacks -->
    <template #feedbacks>
      <FeedbackListComponent
        :editor="editor"
        :feedbacks="feedbacks"
        :create-feedback="(feedback) => createFeedback(feedback)"
        :update-feedback="(feedback, attributes) => updateFeedback(feedback, attributes)"
        :remove-feedback="(feedback) => removeFeedback(feedback)"
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
          @update:options="updateOptions($event)"
        />
      </div>
    </template>
  </TaskScaffold>
</template>

<script lang="ts">
export default {
  name: "TaskSingleChoice",
};
</script>

<script setup lang="ts">
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconShuffle from "@/helpers/icons/IconShuffle.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import TaskScaffold from "@/extensions/task/base/TaskScaffold.vue";
import FeedbackListComponent from "@/extensions/feedback/FeedbackListComponent.vue";
import { v4 as uuid } from "uuid";

import { useTask } from "@/extensions/task/helpers";
import { formatOptions } from "@/extensions/task/single-choice/format/options";
import { formatContent } from "@/extensions/task/single-choice/format/content";
import { formatState } from "@/extensions/task/single-choice/format/state";
import { formatFeedbacks } from "@/extensions/task/single-choice/format/feedbacks";
import {
  formatEvaluation,
  evaluationOptions,
} from "@/extensions/task/single-choice/format/evaluation";
import OptionsDefaults from "@/helpers/tasks/OptionsDefaults.vue";
import OptionsFormEnum from "@/helpers/tasks/OptionsFormEnum.vue";
import { calculateHexIcon } from "@/helpers/util";
import { onBeforeUnmount, onMounted } from "vue";

// Types
import type { JSONContent } from "@tiptap/vue-3";
import type {
  SCOption,
  SCEvaluation,
  SCOptions,
  SCState,
} from "@/extensions/task/single-choice/types";
import type {
  EventOption,
  EventOptionCondition,
  EventOptionConditionBoolean,
} from "@/extensions/feedback/types";
import ConfigurationButton from "@/extensions/feedback/hint/ConfigurationButton.vue";
import { isEqual } from "lodash-es";
import { formatTriggers } from "@/extensions/task/single-choice/format/triggers";
import { Editor } from "@tiptap/vue-3";
import { EventTrigger, StoredFeedback } from "@/extensions/feedback/types";

interface SCProps {
  id: string;
  editor: Editor;
  options?: SCOptions;
  content?: SCOption[];
  evaluation?: SCEvaluation;
  state?: SCState;
  feedbacks?: StoredFeedback[];
  triggers?: EventTrigger[];
}

interface SCEmits {
  (e: "update:options", options: SCOptions): void;
  (e: "update:content", content: SCOption[]): void;
  (e: "update:evaluation", evaluation: SCEvaluation): void;
  (e: "update:state", state: SCState): void;
  (e: "update:feedbacks", feedbacks: StoredFeedback[]): void;
  (e: "update:triggers", triggers: EventTrigger[]): void;
  (
    e: "update",
    task: {
      options?: SCOptions;
      content?: SCOption[];
      evaluation?: SCEvaluation;
      state?: SCState;
      feedbacks?: StoredFeedback[];
      triggers?: EventTrigger[];
    }
  ): void;
  (e: "submit"): void;
}

const props = defineProps<SCProps>();
const emit = defineEmits<SCEmits>();

const {
  updateContent,
  updateEvaluation,
  updateFeedbacks,
  updateOptions,
  updateState,
  //createFeedback,
  //updateFeedback,
  //removeFeedback,
} = useTask<SCProps, SCEmits, SCOptions, SCOption[], SCEvaluation, SCState>(props, emit, [
  formatOptions,
  formatContent,
  formatEvaluation,
  formatState,
  formatFeedbacks,
  formatTriggers,
]);

/**
 * Task specific functions
 */

const addOption = () => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.push({
      id: uuid(),
      content: { type: "doc", content: [{ type: "paragraph" }] },
    });
    updateContent(contentCopy);
  }
};

const removeOption = (index: number) => {
  if (Array.isArray(props.content)) {
    if (props.content.length > 1) {
      const contentCopy = props.content;
      contentCopy.splice(index, 1);
      updateContent(contentCopy);
    }
  }
};

const moveUpOption = (index: number, option: SCOption) => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.splice(index - 1, 0, option);
    contentCopy.splice(index + 1, 1);
    updateContent(contentCopy);
  }
};

const moveDownOption = (index: number, option: SCOption) => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.splice(index + 2, 0, option);
    contentCopy.splice(index, 1);
    updateContent(contentCopy);
  }
};

const updateAnswerOptionValue = (option: SCOption) => {
  if (!!props.evaluation && Array.isArray(props.evaluation.solution)) {
    const newSolution = props.evaluation.solution.map((s) => {
      return { ...s, value: s.id === option.id };
    });
    updateEvaluation({ ...props.evaluation, solution: newSolution });
  }
};

const updateAnswerOptionContent = (option: SCOption, $event: JSONContent) => {
  if (Array.isArray(props.content)) {
    updateContent(props.content.map((o) => (option?.id === o.id ? { ...o, content: $event } : o)));
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
      updateState({
        ...props.state,
        answer: newAnswer,
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

const getEventOptionConditions = (content: SCOption[] | undefined): EventOptionCondition[] => {
  return [
    {
      name: "response-correct",
      variable: "response",
      type: "Boolean" as const,
      label: {
        message: "global.condition.single-choice.response-correct",
      },
      editable: false,
      default: true,
    },
    {
      name: "response-incorrect",
      variable: "response",
      type: "Boolean" as const,
      label: {
        message: "global.condition.single-choice.response-incorrect",
      },
      editable: false,
      default: false,
    },
    ...getAnswerOptionConditions(content),
  ];
};

const getAnswerOptionConditions = (
  content: SCOption[] | undefined
): EventOptionConditionBoolean[] => {
  return !!content && Array.isArray(content)
    ? [
        ...content.map((option, index) => {
          return {
            name: "answer-option-selected-" + option.id,
            variable: "answer-option-" + option.id,
            type: "Boolean" as const,
            label: {
              message: "global.condition.single-choice.answer-option-selected",
              data: {
                index: index + 1,
              },
            },
            editable: false,
            default: true,
          };
        }),
        ...content.map((option, index) => {
          return {
            name: "answer-option-not-selected-" + option.id,
            variable: "answer-option-" + option.id,
            type: "Boolean" as const,
            label: {
              message: "global.condition.single-choice.answer-option-not-selected",
              data: {
                index: index + 1,
              },
            },
            editable: false,
            default: false,
          };
        }),
      ]
    : [];
};

const eventOption: EventOption = {
  name: "answer-submitted",
  parent: props.id,
  label: {
    message: "global.event.type-answer-submitted",
    hexIcon: calculateHexIcon(props.id),
  },
  facts: getEventOptionConditions(props.content),
};

onMounted(() => {
  props.editor.commands.addEventOption(eventOption);
});

onBeforeUnmount(() => {
  // props.editor.commands.removeEventOption(eventOption);
});

const createFeedback = (feedback: StoredFeedback) => {
  console.log("createFeedback local");
  updateFeedbacks([...(!!props.feedbacks ? props.feedbacks : []), feedback]);
};

const updateFeedback = (feedback: StoredFeedback, attributes: Partial<StoredFeedback>) => {
  console.log("updateFeedback local");
  if (!!props.feedbacks) {
    updateFeedbacks(
      props.feedbacks.map((f: StoredFeedback) =>
        f.id === feedback.id ? { ...f, ...attributes } : f
      )
    );
  }
};

const removeFeedback = (feedback: StoredFeedback) => {
  console.log(
    "removeFeedback",
    feedback,
    !!props.feedbacks,
    props.feedbacks?.filter((f: StoredFeedback) => f.id !== feedback.id)
  );
  if (!!props.feedbacks) {
    updateFeedbacks(props.feedbacks.filter((f: StoredFeedback) => f.id !== feedback.id));
  }
};

defineExpose({
  updateContent,
  updateEvaluation,
  updateFeedbacks,
  updateOptions,
  updateState,
  addOption,
  removeOption,
  moveUpOption,
  moveDownOption,
  updateAnswerOptionValue,
  updateAnswerOptionContent,
  changeAnswerOptionValue,
  evaluationOptions,
  createFeedback,
  updateFeedback,
  removeFeedback,
});
</script>
