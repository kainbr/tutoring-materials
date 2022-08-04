import { stateStore } from "@/helpers/store";
import type { StateStore } from "@/helpers/store";
import { saveAs } from "file-saver";
import { v4 as uuid } from "uuid";
import { Plugin, PluginKey } from "prosemirror-state";
import { findChildren, mergeAttributes, Node } from "@tiptap/core";
import mitt from "mitt";
import type { Emitter } from "mitt";

import type { StoreDefinition } from "pinia";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Scaffold, EventTrigger, MarkScaffold, Events, EventOption } from "@/types";
import EventTriggerComponent from "@/events/EventTriggerComponent.vue";

export interface DocumentOptions {
  isEditor: boolean;
  taskLimit: number;
}

export interface DocumentStorage {
  // tasks: () => number;
  // scaffoldMarks: () => [];
  stateStore: () => StateStore | null;
  eventBus: Emitter<Events>;
  eventOptions: EventOption[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    document: {
      /**
       *
       */
      saveDocument: () => ReturnType;
      /**
       *
       */
      uploadDocument: (file: Blob) => ReturnType;
      /**
       *
       */
      addScaffold: (scaffold: Scaffold) => ReturnType;
      /**
       *
       */
      updateScaffold: (scaffold: Scaffold, attributes: object) => ReturnType;
      /**
       *
       */
      removeScaffold: (scaffold: Scaffold) => ReturnType;
      /**
       *
       */
      addEventTrigger: (trigger: EventTrigger) => ReturnType;
      /**
       *
       */
      updateEventTrigger: (trigger: EventTrigger, attributes: object) => ReturnType;
      /**
       *
       */
      removeEventTrigger: (trigger: EventTrigger) => ReturnType;
    };
  }
}

export const Document = Node.create<DocumentOptions, DocumentStorage>({
  name: "document",

  priority: 1000,

  defining: true,

  group: "block",

  content: "block*",

  addOptions() {
    return {
      isEditor: false,
      taskLimit: -1,
    };
  },

  addStorage() {
    return {
      // tasks: () => 0,
      // scaffoldMarks: () => [],
      stateStore: () => null,
      eventBus: mitt(),
      eventOptions: [],
    };
  },

  addAttributes() {
    return {
      scaffolds: {
        default: [],
      },
      triggers: {
        default: [],
      },
    };
  },

  onBeforeCreate() {
    const storeId = Date.now();
    this.storage.stateStore = () => stateStore(storeId);
  },

  onCreate() {
    // Register event listener here
    if (!this.options.isEditor) {
      this.storage.eventBus.on("*", (type, e) => {
        console.log("document listener", type, e);

        const document = findChildren(
          this.editor.state.doc,
          (node) => node.type.name === "document"
        )[0];
        const stateStore = this.storage.stateStore();

        const eventTriggerWithType = document.node.attrs.triggers.filter(
          (trigger: EventTrigger) => trigger.event === type
        );

        eventTriggerWithType.forEach((eventTrigger: EventTrigger) => {
          // Todo: Check conditions

          // Trigger the scaffolds
          eventTrigger.scaffoldIds.forEach((scaffoldId: string) => {
            const scaffold = document.node.attrs.scaffolds.find(
              (s: Scaffold) => s.id === scaffoldId
            );
            if (scaffold && stateStore) {
              stateStore.addScaffold(scaffold);
            }
          });
        });

        console.log("available eventTrigger", document.node.attrs.triggers);
      });
    }

    // Add selectable global events
    this.storage.eventOptions = [
      ...this.storage.eventOptions,
      {
        name: "document-created",
        conditions: [],
      },
    ];
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      addScaffold:
        (scaffold) =>
        ({ commands }) => {
          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];
          const scaffoldWithId = { ...scaffold, id: uuid() };
          commands.updateAttributes("document", {
            scaffolds: [...documentNode.node.attrs.scaffolds, scaffoldWithId],
          });
          return true;
        },

      updateScaffold:
        (scaffold, attributes) =>
        ({ commands }) => {
          if (!scaffold.id) {
            return false;
          }

          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];

          const newScaffolds = documentNode.node.attrs.scaffolds;
          const index = newScaffolds.findIndex((s: Scaffold) => {
            return s.id === scaffold.id && s.id;
          });

          if (!index && index !== 0) {
            return false;
          }

          newScaffolds[index].config = { ...newScaffolds[index].config, ...attributes };

          commands.updateAttributes("document", {
            scaffolds: newScaffolds,
          });

          return true;
        },

      removeScaffold:
        (scaffold) =>
        ({ commands }) => {
          if (!scaffold.id) {
            return false;
          }

          if (scaffold.type === "scaffold-mark") {
            // Check if this is the last scaffold with this ref
            const document = findChildren(
              this.editor.state.doc,
              (node) => node.type.name === "document"
            )[0];

            const scaffoldsWithRef = document.node.attrs.scaffolds.filter((s: Scaffold) => {
              return "ref" in s.config && s.config.ref === (scaffold as MarkScaffold).config.ref;
            });

            if (scaffoldsWithRef.length <= 1) {
              commands.removeScaffoldMark((scaffold as MarkScaffold).config.ref);
            }
          }

          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];
          commands.updateAttributes("document", {
            scaffolds: documentNode.node.attrs.scaffolds.filter(
              (s: Scaffold) => s.id !== scaffold.id
            ),
            // Remove scaffold from triggers using it
            triggers: documentNode.node.attrs.triggers.map((trigger: EventTrigger) => {
              trigger.scaffoldIds = trigger.scaffoldIds.filter((id) => id !== scaffold.id);
              return trigger;
            }),
          });

          const store = this.storage.stateStore();

          if (!!store) {
            store.removeScaffold(scaffold);
          }

          return true;
        },

      saveDocument: () => () => {
        const stateStore = this.storage.stateStore();
        if (stateStore) {
          const data = JSON.stringify({
            content: this.editor.getJSON(),
            state: stateStore.$state,
          });
          const blob = new Blob([data], {
            type: "application/json;charset=utf-8",
          });
          saveAs(blob, "export.json");
          return true;
        }
        return false;
      },

      uploadDocument: (file: Blob) => () => {
        if (!file) {
          return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const stateStore = this.storage.stateStore();
          if (stateStore && e.target?.result) {
            const payload = JSON.parse(String(e.target.result));
            this.editor.commands.setContent(
              "content" in payload ? payload.content : undefined,
              true
            );
            stateStore.$reset();
          }
        };
        reader.readAsText(file);
        return true;
      },

      addEventTrigger:
        (trigger) =>
        ({ commands }) => {
          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];
          const eventTriggerWithId = { ...trigger, id: uuid() };
          return commands.updateAttributes("document", {
            triggers: [...documentNode.node.attrs.triggers, { ...trigger, ...eventTriggerWithId }],
          });
        },

      updateEventTrigger:
        (trigger, attributes) =>
        ({ commands }) => {
          if (!trigger.id) {
            return false;
          }

          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];

          const newTriggers = documentNode.node.attrs.triggers;
          const index = newTriggers.findIndex((t: EventTrigger) => {
            return t.id === trigger.id && t.id;
          });

          if (!index && index !== 0) {
            return false;
          }

          newTriggers[index] = { ...newTriggers[index], ...attributes };

          commands.updateAttributes("document", {
            triggers: newTriggers,
          });

          return true;
        },

      removeEventTrigger:
        (trigger) =>
        ({ commands }) => {
          if (!trigger.id) {
            return false;
          }

          const documentNode = findChildren(
            this.editor.state.doc,
            (node) => node.type.name === "document"
          )[0];
          commands.updateAttributes("document", {
            triggers: documentNode.node.attrs.triggers.filter(
              (t: EventTrigger) => t.id !== trigger.id
            ),
          });

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      // Schema
      /*
      new Plugin({
        key: new PluginKey("schema"),
        filterTransaction: (transaction) => {
          // Nothing has changed. Ignore it.
          if (!transaction.docChanged) {
            return true;
          }

          function countDescendantTasks(input: any) {
            const parentValue =
              input.type.name === "task" || input.type.name === "infobox"
                ? 1
                : 0;
            if (
              typeof input.content.content === "undefined" ||
              input.content.content.length === 0
            ) {
              return parentValue;
            } else {
              return (
                parentValue +
                Math.max(...input.content.content.flatMap(countDescendantTasks))
              );
            }
          }

          // Check if there multiple descendant task nodes
          return countDescendantTasks(transaction.doc) <= 1;
        },
      }),
      
       */
      // Task count and limit
      /*
      new Plugin({
        key: new PluginKey("taskCount"),
        filterTransaction: (transaction) => {
          const limit = this.options.taskLimit;

          // Nothing has changed. Ignore it.
          if (
            !transaction.docChanged ||
            limit < 0 ||
            limit === null ||
            limit === undefined
          ) {
            return true;
          }

          const newSize = this.storage.tasks({
            node: transaction.doc,
          }).length;

          // Everything is in the limit. Good.
          if (newSize <= limit) {
            return true;
          }

          // The limit has been exceeded.
          console.error(
            "The limit of number of tasks has been exceeded. Transaction is not carried out."
          );

          return false;
        },
      }),
       */
    ];
  },
});
