import { defineStore } from "pinia";
import type { Store } from "pinia";
import { v4 as uuid } from "uuid";
import type { Scaffold, Task } from "@/types";

const definedStores = new Map();

interface State {
  tasks: Task[];
  scaffolds: Scaffold[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters {}

interface Actions {
  addScaffold(scaffold: Scaffold): void;
  updateScaffold(scaffold: Scaffold, attributes: object): void;
  removeScaffold(scaffold: Scaffold): void;
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
      scaffolds: [],
    }),
    getters: {},
    actions: {
      addScaffold(scaffold): void {
        if (!scaffold.type) {
          return;
        }

        if (!scaffold.id) {
          scaffold.id = uuid();
        }

        const index = this.scaffolds.findIndex(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(scaffold))
        );

        if (!index) {
          return;
        }

        this.scaffolds = [...this.scaffolds, scaffold];
      },

      updateScaffold(scaffold, attributes): void {
        const index = this.scaffolds.findIndex(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) ===
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(scaffold))
        );

        if (!index) {
          return;
        }

        this.scaffolds[index] = { ...this.scaffolds[index], ...attributes };
      },

      removeScaffold(scaffold) {
        this.scaffolds = this.scaffolds.filter(
          (s) =>
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(s)) !==
            JSON.stringify((({ type, parent, config }) => ({ type, parent, config }))(scaffold))
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
    scaffolds: [],
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
        if (attribute === "scaffolds" && Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            const scaffold = data[i];
            if (scaffold.type === "text") {
              // EventBus.emit("notification", scaffold.content);
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
