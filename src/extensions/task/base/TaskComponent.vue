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
          <!-- eslint-disable vue/no-v-html -->
          <span class="pl-2 pr-3" v-html="calculateHexIcon(node.attrs.id)" />
          <div class="flex w-full justify-center">
            <span>{{ $t("editor.task.type-" + node.attrs.type) }}</span>
          </div>
          <IconClose
            @click="
              deleteNode();
              editor.commands.removeTaskState(state);
            "
          ></IconClose>
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
        :options="node.attrs.options"
        :content="node.attrs.content"
        :evaluation="node.attrs.evaluation"
        :state="state"
        :feedbacks="node.attrs.feedbacks"
        :triggers="node.attrs.triggers"
        @update="update"
      />

      <div v-if="!editor.isEditable && !!state" class="my-1 w-full">
        <SubmitButton
          :id="node.attrs.id"
          :type="node.attrs.type"
          :options="node.attrs.options"
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
import { computed, defineComponent, onMounted } from "vue";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import { calculateHexIcon } from "@/helpers/util";
import IconClose from "@/helpers/icons/IconClose.vue";
import SubmitButton from "@/extensions/task/base/SubmitButton.vue";

import SingleChoice from "@/extensions/task/single-choice/TaskComponent.vue";

import type { Ref } from "vue";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { NodeViewProps } from "@tiptap/core";
import type { PropType } from "vue";
import type { TaskContent, TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";

export default defineComponent({
  components: {
    IconClose,
    NodeViewContent,
    NodeViewWrapper,
    SubmitButton,
    SingleChoice,
  },

  props: {
    editor: {
      type: Object as PropType<NodeViewProps["editor"]>,
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
    const state: Ref<TaskState> = computed(() => {
      return props.editor.storage.tasks.taskStates.find(
        (taskState: TaskState) => taskState.id === props.node.attrs.id
      );
    });

    const update = (newValues: {
      options: TaskOptions;
      content: TaskContent;
      evaluation: TaskEvaluation;
      state: TaskState;
      feedbacks: Feedback[];
      triggers: EventTrigger[];
    }) => {
      props.updateAttributes({
        options: newValues.options,
        content: newValues.content,
        evaluation: newValues.evaluation,
        feedbacks: newValues.feedbacks,
        triggers: newValues.triggers,
      });
      if (!state.value) {
        props.editor.commands.addTaskState(newValues.state);
      } else {
        props.editor.commands.updateTaskState(state.value, newValues.state);
      }
    };

    onMounted(() => {
      props.editor.storage.document.eventBus().emit("task-created", {
        parent: props.node.attrs.id,
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
    });

    return {
      state,
      calculateHexIcon,
      update,
    };
  },
});
</script>
