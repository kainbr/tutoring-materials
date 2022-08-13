<template>
  <TaskScaffold :is-editor="editor.isEditable" contenteditable="false">
    <!-- Render -->
    <template #render> Multiple-Choice Rendering </template>

    <!-- Content -->
    <template #content> Multiple-Choice Content </template>

    <!-- Options -->
    <template #options> Multiple-Choice Options </template>
  </TaskScaffold>
</template>

<script lang="ts">
export default {
  name: "MultipleChoiceTaskComponent",
};
</script>

<script setup lang="ts">
import TaskScaffold from "@/helpers/tasks/TaskScaffold.vue";
import { TaskEmits, TaskProps } from "@/tasks/types";
import { Editor } from "@tiptap/vue-3";
import {
  SCEvaluation,
  SCFeedback,
  SCOption,
  SCOptions,
  SCState,
} from "@/tasks/single-choice/types";

interface SingleChoiceProps extends TaskProps {
  id: string;
  editor: Editor;
  content: SCOption[] | null;
  evaluation: SCEvaluation | null;
  feedbacks: SCFeedback[] | null;
  options: SCOptions | null;
  state: SCState | null;
}

interface SingleChoiceEmits extends TaskEmits {
  (e: "update:content", content: SCOption[]): void;
  (e: "update:evaluation", evaluation: SCEvaluation): void;
  (e: "update:feedbacks", feedbacks: SCFeedback): void;
  (e: "update:options", options: SCOptions): void;
  (e: "update:state", options: SCState): void;
  (e: "submit"): void;
}

const props = defineProps<SingleChoiceProps>();

const emit = defineEmits<SingleChoiceEmits>();

defineExpose({});
</script>
