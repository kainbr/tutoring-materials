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
      <!-- Configuration menu -->
      <div
        v-if="editor.isEditable"
        class="flex flex-row items-center pb-2 mb-2 border-b-2 border-slate-300"
        contenteditable="false"
        data-drag-handle
        draggable="true"
      >
        <div class="flex flex-row grow items-center gap-4">
          <!-- Type -->
          <div class="flex flex-row items-center mx-auto">
            <span class="text-sm"> {{ $t("editor.task.type-description") }}: </span>
            <Listbox :model-value="node.attrs.type" class="ml-2 w-56">
              <div class="relative">
                <ListboxButton
                  class="relative w-full rounded-lg bg-white py-1.5 pl-2.5 pr-8 text-left cursor-pointer focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                >
                  <span class="block truncate">
                    {{
                      $t(
                        "editor.task.type-" +
                          taskOptions.find((option) => option === node.attrs.type)
                      )
                    }}
                  </span>
                  <span
                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M12 15l-4.243-4.243 1.415-1.414L12 12.172l2.828-2.829 1.415 1.414z"
                      />
                    </svg>
                  </span>
                </ListboxButton>

                <transition
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <ListboxOptions
                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    style="padding-left: 0"
                  >
                    <!--suppress JSValidateTypes -->
                    <ListboxOption
                      v-for="option in taskOptions"
                      :key="option"
                      v-slot="{ active, selectedOption }"
                      :value="option"
                      as="template"
                      class="cursor-pointer"
                      @click="changeTaskType(option)"
                    >
                      <li
                        :class="[
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                          'relative py-2 px-3 my-0',
                        ]"
                      >
                        <span
                          :class="[
                            selectedOption ? 'font-medium' : 'font-normal',
                            'block truncate',
                          ]"
                        >
                          {{ $t("editor.task.type-" + option) }}
                        </span>
                        <span
                          v-if="selectedOption"
                          class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                        >
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <div>
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
      </div>
      <!-- Instruction -->
      <div class="flex flex-row w-full [&_p]:my-0">
        <node-view-content class="w-full" />
      </div>

      <!-- Task -->
      <component
        :is="node.attrs.type"
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
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import SingleChoice from "@/tasks/single-choice/TaskComponent.vue";
import MultipleChoice from "@/tasks/multiple-choice/TaskComponent.vue";
import type { PropType } from "vue";
import type { NodeViewProps } from "@tiptap/core";
import type { TaskState } from "@/tasks/types";
import { storeToRefs } from "pinia";
import type { Feedback } from "@/types";
import { evaluate } from "@/tasks/evaluate";
import SubmitButton from "@/helpers/tasks/SubmitButton.vue";

export default defineComponent({
  components: {
    SingleChoice,
    SubmitButton,
    MultipleChoice,
    NodeViewWrapper,
    NodeViewContent,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
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
