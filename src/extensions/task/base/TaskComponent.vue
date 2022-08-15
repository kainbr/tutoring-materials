<template>
  <node-view-wrapper
    :class="[
      editor.isEditable
        ? 'py-2 bg-orange-100 border border-orange-300 rounded-md px-4 mb-4'
        : 'py-2',
    ]"
    class="flex w-full"
  >
    <div class="flex flex-col w-full">
      <div
        v-if="editor.isEditable"
        class="flex flex-row items-center pb-2 mb-2 border-b-2 border-slate-300"
        contenteditable="false"
        data-drag-handle
        draggable="true"
      >
        <div class="flex flex-row grow items-center gap-4">
          <div class="flex w-full justify-center">
            <span>{{ $t("editor.task.type-" + node.attrs.type.substring(5)) }}</span>
          </div>
          <svg
            class="cursor-pointer"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            @click="deleteNode()"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
            />
          </svg>
        </div>
      </div>

      <!-- Instruction -->
      <div class="flex flex-row w-full [&_p]:my-0">
        <node-view-content class="w-full" />
      </div>

      <!-- Task -->
      <component
        :is="node.attrs.type.substring(5)"
        :id="node.attrs.id"
        :editor="editor"
        :content="node.attrs.content"
        :evaluation="node.attrs.evaluation"
        :feedbacks="node.attrs.feedbacks"
        :options="node.attrs.options"
        :state="taskState"
        @update:content="updateAttributes({ content: $event })"
        @update:evaluation="updateAttributes({ evaluation: $event })"
        @update:feedbacks="updateAttributes({ feedbacks: $event })"
        @update:options="updateAttributes({ options: $event })"
        @update:state="updateTaskState"
      />

      <div v-if="!editor.isEditable && !!taskState" class="my-1 w-full">
        <SubmitButton v-bind="buttonProps" @submit="submit"> </SubmitButton>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import SubmitButton from "@/helpers/tasks/SubmitButton.vue";
import { evaluate } from "@/extensions/task/evaluate";
import { storeToRefs } from "pinia";
import type { Feedback } from "@/types";
import type { NodeViewProps } from "@tiptap/core";
import type { PropType } from "vue";
import type { TaskState } from "@/tasks/types";

import SingleChoice from "@/extensions/task/single-choice/TaskComponent.vue";

export default defineComponent({
  components: {
    NodeViewContent,
    NodeViewWrapper,
    SubmitButton,
    SingleChoice,
  },

  props: {
    // eslint-disable-next-line vue/require-default-prop
    editor: {
      type: Object as PropType<NodeViewProps["editor"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    node: {
      type: Object as PropType<NodeViewProps["node"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    decorations: {
      type: Object as PropType<NodeViewProps["decorations"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    selected: {
      type: Boolean as PropType<NodeViewProps["selected"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    extension: {
      type: Object as PropType<NodeViewProps["extension"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    getPos: {
      type: Function as PropType<NodeViewProps["getPos"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true as const,
    },
    // eslint-disable-next-line vue/require-default-prop
    deleteNode: {
      type: Function as PropType<NodeViewProps["deleteNode"]>,
      required: true as const,
    },
  },

  setup: function (props) {
    const taskOptions = ["single-choice", "multiple-choice"];

    const stateStore = props.editor.storage.document.stateStore();
    const { tasks, feedbacks } = storeToRefs(stateStore);

    const taskState = computed(() => {
      return tasks.value?.find((task: TaskState) => task.id === props.node.attrs.id);
    });

    const taskFeedbacks = computed(() => {
      return feedbacks.value?.filter(
        (feedback: Feedback) => feedback.parent === props.node.attrs.id
      );
    });

    const updateTaskState = (newTaskState: TaskState) => {
      if (!taskState.value) {
        stateStore.addTask(newTaskState);
        props.editor.storage.document.eventBus.emit("task-created", newTaskState);
      } else {
        stateStore.updateTask(props.node.attrs.id, newTaskState);
      }
    };

    const changeTaskType = (newTaskType: string) => {
      console.log("changeTaskType", newTaskType);
      props.updateAttributes({
        type: newTaskType,
        content: null,
        evaluation: null,
        feedbacks: [],
        options: null,
        state: null,
      });
    };

    /**
     * Evaluate the response and determine the next state of the task
     * Possible values are: correct, incorrect and final-incorrect
     */
    const submit = async () => {
      // Evaluate answer
      const response = await evaluate(
        props.node.attrs.type,
        props.node.attrs.evaluation,
        taskState.value
      );

      // Emit event
      props.editor.storage.document.eventBus.emit("answer-submitted", {
        ...taskState.value,
        response,
      });

      if (response) {
        updateTaskState({ ...taskState.value, state: "correct" });
      } else {
        if (
          props.node.attrs.options.hasMaxAttempts &&
          taskState.value.attempt >= props.node.attrs.options.maxAttempts
        ) {
          updateTaskState({ ...taskState.value, state: "final-incorrect" });
        } else {
          updateTaskState({
            ...taskState.value,
            state: "incorrect",
            attempt: taskState.value.attempt + 1,
          });
        }
      }
    };

    const buttonProps = computed(() => {
      let labels = {};
      switch (taskState.value.state) {
        case "correct":
          labels = {
            title: props.node.attrs.options.titleCorrectAnswer,
            text: props.node.attrs.options.textCorrectAnswer,
          };
          break;
        case "incorrect":
          labels = {
            title: props.node.attrs.options.titleIncorrectAnswer,
            text: props.node.attrs.options.textIncorrectAnswer,
          };
          break;
        case "final-incorrect":
          labels = {
            title: props.node.attrs.options.titleFinalIncorrectAnswer,
            text: props.node.attrs.options.textFinalIncorrectAnswer,
          };
          break;
      }
      return {
        id: props.node.attrs.id,
        textSubmitButton: props.node.attrs.options.textSubmitButton,
        state: taskState.value.state,
        disabled:
          !props.node.attrs.options.allowEmptyAnswerSubmission && taskState.value.isEmptyAnswer,
        ...labels,
      };
    });

    return {
      taskOptions,
      taskState,
      taskFeedbacks,
      buttonProps,
      updateTaskState,
      changeTaskType,
      submit,
    };
  },
});
</script>
