import { provide, ref } from "vue";
import type { Ref } from "vue";

import type { TaskState } from "@/extensions/task/types";

export type ProvidedTaskStates = {
  taskStates: Ref<TaskState[]>;
  addTaskState: (taskState: TaskState) => void;
  updateTaskState: (taskState: TaskState, attributes: Partial<TaskState>) => void;
  removeTaskState: (taskState: TaskState) => void;
};

export default function () {
  const taskStates: Ref<TaskState[]> = ref([]);

  function addTaskState(taskState: TaskState) {
    const state = taskStates.value.find((t: TaskState) => taskState.id === t.id);

    if (!!state) {
      return false;
    }

    taskStates.value = [...taskStates.value, taskState];
  }

  function updateTaskState(taskState: TaskState, attributes: Partial<TaskState>) {
    taskStates.value = taskStates.value.map((ts: TaskState) => {
      if (ts.id !== taskState.id) {
        return { ...ts };
      } else {
        return { ...ts, ...attributes };
      }
    });
  }

  function removeTaskState(taskState: TaskState) {
    taskStates.value = taskStates.value.filter((ts: TaskState) => ts.id !== taskState.id);
  }

  provide("tasks", {
    taskStates,
    addTaskState,
    updateTaskState,
    removeTaskState,
  });

  return {
    taskStates,
    addTaskState,
    updateTaskState,
    removeTaskState,
  };
}
