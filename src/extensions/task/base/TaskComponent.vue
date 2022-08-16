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
          <IconClose @click="deleteNode()"></IconClose>
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
        :state="state"
        :active-feedbacks="activeFeedbacks"
        @update:content="updateAttributes({ content: $event })"
        @update:evaluation="updateAttributes({ evaluation: $event })"
        @update:feedbacks="updateAttributes({ feedbacks: $event })"
        @update:options="updateAttributes({ options: $event })"
        @update:state="
          !state
            ? editor.commands.addTaskState($event)
            : editor.commands.updateTaskState(state, $event)
        "
      />

      <div v-if="!editor.isEditable && !!state" class="my-1 w-full">
        <SubmitButton
          :editor="editor"
          :type="node.attrs.type.substring(5)"
          :options="node.attrs.options"
          :evaluation="node.attrs.evaluation"
          :state="state"
        >
        </SubmitButton>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/vue-3";
import IconClose from "@/helpers/icons/IconClose.vue";
import SubmitButton from "@/extensions/task/base/SubmitButton.vue";

import SingleChoice from "@/extensions/task/single-choice/TaskComponent.vue";

import type { Ref } from "vue";
import type { Feedback } from "@/extensions/feedback/types";
import type { NodeViewProps } from "@tiptap/core";
import type { PropType } from "vue";
import type { TaskState } from "@/extensions/task/base/types";

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
      return props.editor.storage.task.taskStates.find(
        (taskState: TaskState) => taskState.id === props.node.attrs.id
      );
    });

    const activeFeedbacks: Ref<Feedback[]> = computed(() => {
      return !!props.editor.storage.feedback?.feedbacks
        ? props.editor.storage.feedback.feedbacks.filter(
            (feedback: Feedback) => feedback.parent === props.node.attrs.id
          )
        : [];
    });

    return { state, activeFeedbacks };
  },
});
</script>
