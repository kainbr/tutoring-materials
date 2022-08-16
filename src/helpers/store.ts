import { defineStore } from "pinia";
import type { Store } from "pinia";
import { v4 as uuid } from "uuid";
import type { Feedback } from "@/extensions/feedback/types";
import type { TaskState } from "@/extensions/task/base/types";

const definedStores = new Map();

export interface State {
  tasks: TaskState[];
  feedbacks: Feedback[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters {}

interface Actions {
  addFeedback(feedback: Feedback): void;
  updateFeedback(feedback: Feedback, attributes: object): void;
  removeFeedback(feedback: Feedback): void;
  addTask(task: TaskState): void;
  updateTask(taskId: string, attributes: object): void;
  removeTask(taskId: string): void;
}

export type StateStore = Store<"state", State, Getters, Actions>;

export const stateStore = (documentId: string | number): StateStore => {
  if (!definedStores.has(documentId)) {
    definedStores.set(documentId, defineStateStore(documentId));
  }
  return definedStores.get(documentId);
};

function defineStateStore(documentId: string | number) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return defineStore<"state", State, Getters, Actions>(`states/${documentId}`, {
    state: () => ({
      tasks: [],
      feedbacks: [],
    }),
    getters: {},
    actions: {
      addFeedback(feedback): void {
        if (!feedback.type) {
          return;
        }

        if (!feedback.id) {
          feedback.id = uuid();
        }

        const index = this.feedbacks.findIndex(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );

        if (!index) {
          return;
        }

        this.feedbacks = [...this.feedbacks, feedback];
      },

      updateFeedback(feedback, attributes): void {
        const index = this.feedbacks.findIndex(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );

        if (!index) {
          return;
        }

        this.feedbacks[index] = { ...this.feedbacks[index], ...attributes };
      },

      removeFeedback(feedback) {
        this.feedbacks = this.feedbacks.filter(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) !==
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(feedback))
        );
      },

      addTask(task): void {
        if (!task.type) {
          return;
        }

        const index = this.tasks.findIndex(
          (s) =>
            JSON.stringify((({ type, answer }) => ({ type, answer }))(s)) ===
            JSON.stringify((({ type, answer }) => ({ type, answer }))(task))
        );

        if (!index) {
          return;
        }

        this.tasks.push(task);
      },

      updateTask(taskId, attributes): void {
        this.tasks = this.tasks.map((task: TaskState) => {
          if (task.id !== taskId) {
            return task;
          } else {
            return { ...task, ...attributes };
          }
        });
      },

      removeTask(taskId) {
        this.tasks = this.tasks.filter((s) => s.id !== taskId);
      },
    },
  })();
}
