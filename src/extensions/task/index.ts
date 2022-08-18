// noinspection JSUnusedGlobalSymbols

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { v4 as uuid } from "uuid";
import type { TaskState } from "@/extensions/task/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    task: {
      /**
       * Todo: Add method description
       */
      addTaskState: (taskState: TaskState) => ReturnType;
      /**
       * Todo: Add method description
       */
      updateTaskState: (taskState: TaskState, attributes: Partial<TaskState>) => ReturnType;
      /**
       * Todo: Add method description
       */
      removeTaskState: (taskState: TaskState) => ReturnType;
      /**
       * Todo: Add method description
       */
    };
  }
}

export interface TaskExtensionStorage {
  taskStates: TaskState[];
}

export const Task = Extension.create<unknown, TaskExtensionStorage>({
  name: "task",

  addStorage() {
    return {
      taskStates: [],
    };
  },

  addCommands() {
    return {
      addTaskState:
        (taskState) =>
        ({}) => {
          if (!taskState.type) {
            return false;
          }

          const state = this.storage.taskStates.find((t: TaskState) => taskState.id === t.id);

          if (!!state) {
            return false;
          }

          this.storage.taskStates = [...this.storage.taskStates, taskState];

          return true;
        },
      updateTaskState:
        (taskState, attributes) =>
        ({}) => {
          this.storage.taskStates = this.storage.taskStates.map((ts: TaskState) => {
            if (ts.id !== taskState.id) {
              return { ...ts };
            } else {
              return { ...ts, ...attributes };
            }
          });

          return true;
        },

      removeTaskState:
        (taskState) =>
        ({}) => {
          this.storage.taskStates = this.storage.taskStates.filter(
            (ts: TaskState) => ts.id !== taskState.id
          );

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("task-id"),
        appendTransaction: (transaction, oldState, newState) => {
          // Nothing has changed. Ignore it.
          if (newState.doc === oldState.doc) {
            return;
          }

          const tr = newState.tr;

          newState.doc.descendants((node, pos) => {
            if (node.isBlock && node.type.name.startsWith("task-") && !node.attrs.id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: uuid(),
              });
            }
          });

          return tr;
        },
      }),
    ];
  },
});
