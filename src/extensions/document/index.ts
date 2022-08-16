import { mergeAttributes, Node } from "@tiptap/core";
import mitt from "mitt";
import type { Emitter } from "mitt";
import type { Event } from "@/extensions/feedback/types";

export interface DocumentOptions {
  isEditor: boolean;
  taskLimit: number;
}

export interface DocumentStorage {
  eventBus: Emitter<Event>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    document: {
      /**
       * Todo: Add method description
       */
      saveDocument: () => ReturnType;
      /**
       * Todo: Add method description
       */
      uploadDocument: (file: Blob) => ReturnType;
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
      eventBus: mitt(),
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  onCreate() {
    if (!this.editor.isEditable) {
      this.editor.commands.addEventOption({
        name: "document-created",
        conditions: [],
      });
    }
  },

  addCommands() {
    return {
      saveDocument: () => () => {
        /*
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
         */
        return false;
      },

      uploadDocument: (file: Blob) => () => {
        /*
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
         */
        return true;
      },
    };
  },
});
