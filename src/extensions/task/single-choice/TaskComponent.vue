<template>
  <TaskScaffold :is-editor="editor.isEditable" contenteditable="false" @submit="$emit('submit')">
    <!-- Render -->
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
            <IconArrowUp></IconArrowUp>
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="index === content.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option)"
          >
            <IconArrowDown></IconArrowDown>
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="content.length <= 1"
            tabindex="-1"
            @click="removeOption(index)"
          >
            <IconTrash></IconTrash>
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
              <IconShuffle></IconShuffle>
            </EditorMenuButton>
            <EditorMenuButton @click="addOption">
              <IconAdd></IconAdd>
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
      {{ feedbacks }}
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
import TaskScaffold from "@/helpers/tasks/TaskScaffold.vue";
import { v4 as uuid } from "uuid";

// Types
import type { Editor, JSONContent } from "@tiptap/vue-3";
import type { TaskEmits, TaskProps } from "@/extensions/task/base/types";
import type {
  SCOption,
  SCEvaluation,
  SCFeedback,
  SCOptions,
  SCState,
} from "@/extensions/task/single-choice/types";
import { useTask } from "@/extensions/task/helpers";
import { formatOptions } from "@/extensions/task/single-choice/options";
import { formatContent } from "@/extensions/task/single-choice/content";
import { formatTaskState } from "@/extensions/task/single-choice/state";
import { formatFeedbacks } from "@/extensions/task/single-choice/feedbacks";
import { formatEvaluation, evaluationOptions } from "@/extensions/task/single-choice/evaluation";
import OptionsDefaults from "@/helpers/tasks/OptionsDefaults.vue";
import OptionsFormEnum from "@/helpers/tasks/OptionsFormEnum.vue";

interface SCProps extends TaskProps {
  id: string;
  editor: Editor;
  content?: SCOption[];
  evaluation?: SCEvaluation;
  feedbacks?: SCFeedback[];
  options?: SCOptions;
  state?: SCState;
}

interface SCEmits extends TaskEmits {
  (e: "update:content", content: SCOption[]): void;
  (e: "update:evaluation", evaluation: SCEvaluation): void;
  (e: "update:feedbacks", feedbacks: SCFeedback): void;
  (e: "update:options", options: SCOptions): void;
  (e: "update:state", options: SCState): void;
  (e: "submit"): void;
}

const props = defineProps<SCProps>();

const emit = defineEmits<SCEmits>();

const { updateContent, updateEvaluation, updateFeedbacks, updateOptions, updateState } = useTask<
  SCProps,
  SCEmits,
  SCOption[],
  SCEvaluation,
  SCFeedback[],
  SCOptions,
  SCState
>(props, emit, formatOptions, formatContent, formatTaskState, formatEvaluation, formatFeedbacks);

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

    if (JSON.stringify(oldAnswer) !== JSON.stringify(newAnswer)) {
      updateState({
        ...props.state,
        answer: newAnswer,
      });

      props.editor.storage.document.eventBus.emit("change-answer", {
        ...props.state,
        answer: newAnswer,
        oldAnswer: oldAnswer,
      });
    }
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
});
</script>
