import { findChildren } from "@tiptap/core";
import { onBeforeUnmount, provide, ref } from "vue";

import type { Editor } from "@tiptap/vue-3";
import type { Ref } from "vue";
import type { TaskState } from "@/extensions/task/types";

export type InjectedTaskStates = {
  taskStates: Ref<TaskState[]>;
  renderedTasks: Ref<string[]>;
  addTaskState: (taskState: TaskState) => void;
  updateTaskState: (taskState: TaskState, attributes: Partial<TaskState>) => void;
  removeTaskState: (taskState: TaskState) => void;
};

export default function (editor: Editor): InjectedTaskStates {
  const taskStates: Ref<TaskState[]> = ref([]);
  const renderedTasks: Ref<string[]> = ref([]);

  function addTaskState(taskState: TaskState) {
    const state = taskStates.value.find((t: TaskState) => taskState.id === t.id);
    if (!state) {
      taskStates.value = [...taskStates.value, taskState];
    }
  }

  function updateTaskState(taskState: TaskState, attributes: Partial<TaskState>) {
    taskStates.value = taskStates.value.map((ts: TaskState) => {
      return { ...ts, ...(ts.id !== taskState.id ? {} : attributes) };
    });
  }

  function removeTaskState(taskState: TaskState) {
    taskStates.value = taskStates.value.filter((ts: TaskState) => ts.id !== taskState.id);
  }

  onBeforeUnmount(() => {
    const taskIds = findChildren(editor.state.doc, (n) => n.type.name === "task").map(
      (n) => n.node.attrs.id
    );
    renderedTasks.value = renderedTasks.value.filter((taskId: string) => !taskIds.includes(taskId));
  });

  provide("tasks", {
    taskStates,
    renderedTasks,
    addTaskState,
    updateTaskState,
    removeTaskState,
  });

  return {
    taskStates,
    renderedTasks,
    addTaskState,
    updateTaskState,
    removeTaskState,
  };
}
