import { defineStore } from "pinia";
import type { Store } from "pinia";
import { v4 as uuid } from "uuid";
import type { Feedback, Task } from "@/types";

const definedStores = new Map();

interface State {
  tasks: Task[];
  feedbacks: Feedback[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters {}

interface Actions {
  addFeedback(feedback: Feedback): void;
  updateFeedback(feedback: Feedback, attributes: object): void;
  removeFeedback(feedback: Feedback): void;
  addTask(task: Task): void;
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

        if (!task.id) {
          task.id = uuid();
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
        const index = this.tasks.findIndex((t) => t.id === taskId);

        if (!index) {
          return;
        }

        this.tasks[index] = Object.assign(this.tasks[index], attributes);
      },

      removeTask(taskId) {
        this.tasks = this.tasks.filter((s) => s.id !== taskId);
      },
    },
  })();
}

/*


export const stateStore = defineStore("states", {
  state: () => ({
    tasks: {},
    feedbacks: [],
  }),
  getters: {
    state: (state) => {
      return (attribute) => {
        if (typeof attribute === "undefined") {
          return undefined;
        } else {
          return state[attribute];
        }
      };
    },
    taskState: (state) => {
      return (id, attribute = undefined) => {
        if (typeof state.tasks[id] === "undefined") {
          return undefined;
        } else {
          if (typeof attribute === "undefined") {
            return state.tasks[id];
          } else {
            return state.tasks[id][attribute];
          }
        }
      };
    },
  },
  actions: {
    setState(attribute, data) {
      if (typeof attribute !== "undefined") {
        this[attribute] = data;
      }
    },
    setTaskState(id, attribute = undefined, data) {
      if (typeof this.tasks[id] === "undefined") {
        this.tasks[id] = {};
      }
      if (typeof attribute === "undefined") {
        this.tasks[id] = data;
      } else {
        this.tasks[id][attribute] = data;

        // Send out notifications
        if (attribute === "feedbacks" && Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            const feedback = data[i];
            if (feedback.type === "text") {
              // EventBus.emit("notification", feedback.content);
            }
          }
        }
      }
    },
    removeTaskState(id) {
      this.tasks[id] = undefined;
    },
  },
});
 */
