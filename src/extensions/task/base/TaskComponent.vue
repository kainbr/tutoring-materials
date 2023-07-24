<template>
  <node-view-wrapper
    :class="[
      isEditableReactive
        ? 'border border-slate-200 shadow-lg rounded-md mb-2'
        : '',
    ]"
    class="flex w-full"
  >
    <div :class="[isEditableReactive ? 'px-4 pb-2' : '']" class="flex flex-col w-full ">
      <div
        v-if="isEditableReactive"
        class="flex flex-row py-3 border-b border-gray-200"
        contenteditable="false"
      >
        <div class="flex flex-row grow items-center">
          <!-- eslint-disable vue/no-v-html -->
          <div data-drag-handle contenteditable="false" draggable="true" style="cursor: grab">
            <span class="pl-1 pr-2 ml-1" v-html="calculateHexIcon(node.attrs.id)" />
          </div>
          <div class="flex w-full">
            <span class="text-base font-semibold leading-6 text-gray-900">{{ $t("editor.task.type-" + node.attrs.type)
              }}</span>
          </div>
          <div class="px-1 cursor-pointer fill-gray-500 hover:fill-gray-600">
            <IconClose @click="removeTask"></IconClose>
          </div>
        </div>
      </div>

      <!-- Instruction -->
      <div :class="[isEditableReactive ? 'py-2': '']" class="flex flex-row w-full [&_p]:my-0">
        <node-view-content class="w-full" />
      </div>

      <!-- Task -->
      <component
        :is="node.attrs.type"
        :id="node.attrs.id"
        :editor="editor"
        :options="optionsWithDefaults"
        :content="node.attrs.content"
        :evaluation="node.attrs.evaluation"
        :state="state"
        @update="update"
      />

      <div v-if="!isEditableReactive && !!state" class="my-1 w-full">
        <SubmitButton
          :id="node.attrs.id"
          :type="node.attrs.type"
          :options="optionsWithDefaults"
          :evaluation="node.attrs.evaluation"
          :state="state"
          :editor="editor"
        >
        </SubmitButton>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, provide, ref } from "vue";
import { Editor, NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import { calculateHexIcon } from "@/helpers/util";
import IconClose from "@/helpers/icons/IconClose.vue";
import SubmitButton from "@/extensions/task/helpers/SubmitButton.vue";

import SingleChoice from "@/extensions/task/single-choice/TaskComponent.vue";
import MultipleChoice from "@/extensions/task/multiple-choice/TaskComponent.vue";
import TrueFalse from "@/extensions/task/true-false/TaskComponent.vue";
import FillTheBlank from "@/extensions/task/fill-the-blank/TaskComponent.vue";
import FindHotspots from "@/extensions/task/find-hotspots/TaskComponent.vue";
import Mapping from "@/extensions/task/mapping/TaskComponent.vue";
import ShortText from "@/extensions/task/short-text/TaskComponent.vue";

import type { Ref } from "vue";
import type { EventOption } from "@/extensions/feedback/types";
import type { NodeViewProps } from "@tiptap/core";
import type { PropType } from "vue";
import type { TaskContent, TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";
import type { InjectedEventBus } from "@/helpers/useEventBus";
import type { InjectedTaskStates } from "@/helpers/useTasks";
import type { InjectedDefaults } from "@/helpers/useDefaults";
import { evaluate } from "@/extensions/task/evaluate";

export type InjectedSubmit = {
  submit: (state: TaskState) => void;
  submittedTaskStates: Ref<TaskState[]>
};

export default defineComponent({
  components: {
    IconClose,
    NodeViewContent,
    NodeViewWrapper,
    SubmitButton,
    SingleChoice,
    MultipleChoice,
    TrueFalse,
    FillTheBlank,
    FindHotspots,
    Mapping,
    ShortText
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    node: {
      type: Object as PropType<NodeViewProps["node"]>,
      required: true,
    },
    decorations: {
      type: Object as PropType<NodeViewProps["decorations"]>,
      required: true,
    },
    selected: {
      type: Boolean as PropType<NodeViewProps["selected"]>,
      required: true,
    },
    extension: {
      type: Object as PropType<NodeViewProps["extension"]>,
      required: true,
    },
    getPos: {
      type: Function as PropType<NodeViewProps["getPos"]>,
      required: true,
    },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true,
    },
    deleteNode: {
      type: Function as PropType<NodeViewProps["deleteNode"]>,
      required: true,
    },
  },

  setup: function (props) {
    const { taskOptions } = inject("defaults") as InjectedDefaults;
    const { eventBus } = inject("eventBus") as InjectedEventBus;
    const { taskStates, renderedTasks, addTaskState, updateTaskState, removeTaskState } = inject(
      "tasks"
    ) as InjectedTaskStates;

    const state: Ref<TaskState | undefined> = computed(() => {
      return taskStates.value.find((taskState: TaskState) => taskState.id === props.node.attrs.id);
    });

    const update = (newValues: {
      options: TaskOptions;
      content: TaskContent;
      evaluation: TaskEvaluation;
      state: TaskState;
      events: EventOption;
    }) => {
      props.updateAttributes({
        options: newValues.options,
        content: newValues.content,
        evaluation: newValues.evaluation,
      });

      if (!state.value) {
        addTaskState(newValues.state);
      } else {
        updateTaskState(state.value, newValues.state);
      }

      // eslint-disable-next-line vue/no-mutating-props
      props.editor.storage.feedbacks.eventOptions = [
        ...props.editor.storage.feedbacks.eventOptions.filter(
          (e: EventOption) => e.parent !== props.node.attrs.id
        ),
        ...(!!newValues.events && Array.isArray(newValues.events) ? newValues.events : []),
      ];
    };

    onMounted(() => {
      if (!renderedTasks.value.includes(props.node.attrs.id) && !props.editor.isEditable) {
        eventBus.emit("interaction", {
          type: "task-created",
          parent: props.node.attrs.id,
          facts: {},
          label: {
            message: "global.event.type-task-created",
            hexIcon: calculateHexIcon(props.node.attrs.id),
          },
          data: {
            id: props.node.attrs.id,
            content: props.node.attrs.content,
            evaluation: props.node.attrs.evaluation,
            feedbacks: props.node.attrs.feedbacks,
            options: props.node.attrs.options,
            state: props.node.attrs.state,
          },
        });

        renderedTasks.value = [...renderedTasks.value, props.node.attrs.id];
      }
    });

    const optionsWithDefaults = computed(() => {
      return {
        ...taskOptions,
        ...props.node.attrs.options,
      };
    });

    const removeTask = () => {
      props.deleteNode();
      if (!!state.value) {
        removeTaskState(state.value);
      }
    };

    /**
     * Evaluate the response and determine the next state of the task
     * Possible values are: correct, incorrect and final-incorrect
     */
    const submittedTaskStates: Ref<TaskState[]> = ref([]);
    const submit = async (state: TaskState) => {
      // Evaluate answer
      const { response, facts } = await evaluate(
        props.node.attrs.type,
        props.node.attrs.evaluation,
        state
      );

      // Set the next state depending on the result and the configuration of the task
      let newState;
      if (response) {
        newState = { ...state, state: "correct" };
      } else {
        if (
          optionsWithDefaults.value.hasMaxAttempts &&
          state.attempt >= optionsWithDefaults.value.maxAttempts
        ) {
          newState = {
            ...state,
            state: "final-incorrect",
          };
        } else {
          newState = {
            ...state,
            state: "incorrect",
            attempt: state.attempt + 1
          };
        }
      }

      updateTaskState(state, newState);

      submittedTaskStates.value = [...submittedTaskStates.value, newState];

      // Emit event
      eventBus.emit("interaction", {
        type: "answer-submitted",
        parent: state.id,
        facts: {
          attempt: state.attempt,
          empty: state.empty,
          response,
          ...facts
        },
        data: {
          ...state,
          response,
        },
        label: {
          message: "global.event.type-answer-submitted",
          hexIcon: calculateHexIcon(state.id),
        },
      });
    };

    provide("submit", { submit, submittedTaskStates });

    const isEditableReactive: Boolean = inject("isEditableReactive", props.editor.isEditable);

    return { state, calculateHexIcon, update, optionsWithDefaults, removeTask, removeTaskState, isEditableReactive };
  },
});
</script>
