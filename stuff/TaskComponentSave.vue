<template>
  <TaskScaffold
    :is-editor="editor.isEditable"
    contenteditable="false"
    @submit="$emit('submit', evaluate(content, evaluation, state))"
  >
    <!-- Render -->
    <template #render>
      <div
        v-for="index in state?.order"
        :key="index"
        class="flex flex-row gap-2 pl-2 items-center cursor-default"
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
          <input :checked="option.value" type="radio" @input="updateAnswerOptionValue(option)" />
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
        <div style="display: flex; flex-direction: row; justify-content: space-between">
          <div class="flex flex-row gap-2 items-center">
            <span> Evaluation </span>
            <div>
              <select
                :value="evaluation?.name"
                class="block w-full py-2 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option v-for="option in evaluationOptions" :key="option.name" :value="option.name">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <div style="display: flex; gap: 1px">
            <EditorMenuButton
              :active="options?.shuffle"
              :on-active-click="() => $emit('update:options', { ...options, shuffle: false })"
              :on-inactive-click="() => $emit('update:options', { ...options, shuffle: true })"
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

    <!-- Options -->
    <template #options>From within the component</template>
  </TaskScaffold>
</template>

<script lang="ts">
export default {
  name: "SingleChoiceTaskComponent",
};
</script>

<script setup lang="ts">
import EditorMenuButton from "../src/helpers/EditorMenuButton.vue";
import IconAdd from "../src/helpers/icons/IconAdd.vue";
import IconArrowDown from "../src/helpers/icons/IconArrowDown.vue";
import IconArrowUp from "../src/helpers/icons/IconArrowUp.vue";
import IconShuffle from "../src/helpers/icons/IconShuffle.vue";
import IconTrash from "../src/helpers/icons/IconTrash.vue";
import InlineEditor from "../src/helpers/InlineEditor.vue";
import TaskScaffold from "../src/helpers/tasks/TaskScaffold.vue";
import { v4 as uuid } from "uuid";
import { initContent, initEvaluation, initFeedbacks, initOptions, initState } from "../src/tasks";

// Types
import type { Editor, JSONContent } from "@tiptap/vue-3";
import type { TaskEmits, TaskProps, TaskState } from "../src/tasks/types";
import type {
  SCOption,
  SCEvaluation,
  SCFeedback,
  SCOptions,
  SCState,
} from "../src/tasks/single-choice/types";
import { SCEvaluationOption, SCOptionAnswer } from "../src/tasks/single-choice/types";
import { defaultTaskOptions } from "../src/extensions/task/base";

interface SCProps extends TaskProps {
  id: string;
  editor: Editor;
  content: SCOption[] | null;
  evaluation: SCEvaluation | null;
  feedbacks: SCFeedback[] | null;
  options: SCOptions | null;
  state: SCState | null;
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

/**
 * Content
 */

const formatContent = (newProps: SCProps, oldProps: SCProps | null): SCOption[] => {
  let content: SCOption[];
  if (!newProps.content) {
    content = defaultContent;
  } else if (!Array.isArray(newProps.content)) {
    content = [];
  } else {
    content = newProps.content.map((option) => {
      const defaultOption = {
        id: uuid(),
        content: {
          type: "doc",
          content: undefined,
        },
        value: false,
      };
      return { ...defaultOption, ...option };
    });
  }

  // Make sure that one option is always correct
  if (content.every((option) => !option.value)) {
    content[0].value = true;
  }

  return content;
};

const defaultContent: SCOption[] = [
  {
    id: uuid(),
    value: true,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
  },
  {
    id: uuid(),
    value: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
  },
  {
    id: uuid(),
    value: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
  },
];

initContent(props, emit, formatContent);

/**
 * Evaluation
 */

const formatEvaluation = (newProps: SCProps, oldProps: SCProps | null): SCEvaluation => {
  if (
    !newProps.evaluation ||
    typeof newProps.evaluation !== "object" ||
    !("name" in newProps.evaluation)
  ) {
    return defaultEvaluation;
  } else {
    switch ((newProps.evaluation as SCEvaluation).name) {
      case "all-match":
      default:
        return newProps.evaluation;
    }
  }
};

const defaultEvaluation = {
  name: "all-match",
};

const evaluationOptions: SCEvaluationOption[] = [
  {
    name: "all-match",
    config: [],
    default: {},
  },
];

const evaluate = (content: SCOption[], config: SCEvaluation, taskState: SCState): boolean => {
  switch (config.name) {
    case "all-match":
      return content.every((contentOption) => {
        return (
          taskState.answer.find((answerOption) => answerOption.id === contentOption.id)?.value ===
          contentOption.value
        );
      });
  }
  return false;
};

initEvaluation(props, emit, formatEvaluation);

/**
 * Feedbacks
 */

const formatFeedbacks = (newProps: SCProps, oldProps: SCProps | null): SCFeedback[] => {
  if (!Array.isArray(newProps.feedbacks)) {
    return [];
  } else {
    return newProps.feedbacks.map((f) => f);
  }
};

initFeedbacks(props, emit, formatFeedbacks);

/**
 * Options
 */

const formatOptions = (newProps: SCProps, oldProps: SCProps | null): SCOptions => {
  return {
    ...defaultTaskOptions,
    ...defaultSingleChoiceOptions,
    ...newProps.options,
  };
};

const defaultSingleChoiceOptions = {
  shuffle: false,
};

initOptions(props, emit, formatOptions);

/**
 * State
 */

function formatAnswer(newProps: SCProps): SCOptionAnswer[] {
  if (!newProps.content || !Array.isArray(newProps.content)) {
    return [];
  } else {
    return newProps.content.map((option: SCOption) => {
      return {
        id: option.id,
        value: !!newProps.state?.answer?.find((o) => o.id === option.id)?.value,
      };
    });
  }
}

function formatOrder(newProps: SCProps, oldProps: SCProps | null): number[] {
  if (!!oldProps && !!oldProps.state.order && ){

  }

  return newProps.options?.shuffle
    ? shuffleArray(Array.from([...Array(newProps.content?.length).keys()]))
    : Array.from([...Array(newProps.content?.length).keys()]);

  const oldOrder = oldProps?.state?.order;
  const newContent = newProps?.content;

  if (!oldOrder || !newContent || oldOrder.length !== newContent.length) {
    return newProps.options?.shuffle
      ? shuffleArray(Array.from([...Array(newProps.content?.length).keys()]))
      : Array.from([...Array(newProps.content?.length).keys()]);
  } else {
    return oldOrder;
  }
}

function shuffleArray(a: number[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTaskState(newProps: SCProps, oldProps: SCProps | null): SCState {
  if (!newProps.state){

  }else{
  return {
    ...newProps.state,
    type: "single-choice",
    answer: formatAnswer(newProps),
    order: formatOrder(newProps, oldProps),
  };
  }
}

initState(props, emit, formatTaskState);

/**
 * Task specific functions
 */

const addOption = () => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.push({
      id: uuid(),
      content: { type: "doc", content: [{ type: "paragraph" }] },
      value: false,
    });
    emit("update:content", contentCopy);
  }
};

const removeOption = (index: number) => {
  if (Array.isArray(props.content)) {
    if (props.content.length > 1) {
      const contentCopy = props.content;
      contentCopy.splice(index, 1);
      emit("update:content", contentCopy);
    }
  }
};

const moveUpOption = (index: number, option: SCOption) => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.splice(index - 1, 0, option);
    contentCopy.splice(index + 1, 1);
    emit("update:content", contentCopy);
  }
};

const moveDownOption = (index: number, option: SCOption) => {
  if (Array.isArray(props.content)) {
    const contentCopy = props.content;
    contentCopy.splice(index + 2, 0, option);
    contentCopy.splice(index, 1);
    emit("update:content", contentCopy);
  }
};

const updateAnswerOptionValue = (option: SCOption) => {
  if (Array.isArray(props.content)) {
    emit(
      "update:content",
      props.content.map((o) => {
        return { ...o, value: o.id === option.id };
      })
    );
  }
};

const updateAnswerOptionContent = (option: SCOption, $event: JSONContent) => {
  if (Array.isArray(props.content)) {
    emit(
      "update:content",
      props.content.map((o) => (option?.id === o.id ? { ...o, content: $event } : o))
    );
  }
};

const changeAnswerOptionValue = (option: SCOption) => {
  if (Array.isArray(props.content)) {
    const oldAnswer = { answer: props.state?.answer };
    const newAnswer = props.content.map((o: SCOption) => {
      return {
        id: o.id,
        value: o.id === option.id,
      };
    });

    emit("update:state", {
      ...props.state,
      answer: newAnswer,
    });

    props.editor.storage.document.eventBus.emit("change-answer", {
      ...props.state,
      answer: newAnswer,
      oldAnswer: oldAnswer,
    });
  }
};

defineExpose({
  addOption,
  removeOption,
  moveUpOption,
  moveDownOption,
  updateAnswerOptionValue,
  updateAnswerOptionContent,
  changeAnswerOptionValue,
  evaluate,
  evaluationOptions,
});
</script>
