import { mergeAttributes, Node } from "@tiptap/core";
import mitt from "mitt";
import type { Emitter } from "mitt";
import type { Event, EventOption } from "@/extensions/feedback/types";
import { saveAs } from "file-saver";
import type { InteractionEvent } from "@/extensions/document/types";

export interface DocumentOptions {
  isEditor: boolean;
  taskLimit: number;
}

export interface DocumentStorage {
  eventBus: () => Emitter<InteractionEvent> | null;
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
      eventBus: () => null,
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes), 0];
  },

  onBeforeCreate() {
    const eventBus = mitt<InteractionEvent>();
    this.storage.eventBus = () => {
      return eventBus;
    };
  },

  onCreate() {
    this.editor.commands.addEventOption({
      name: "document-created",
      label: { message: "global.event.type-document-created" },
      conditions: [],
    });
  },

  addCommands() {
    return {
      saveDocument: () => () => {
        const data = JSON.stringify({
          content: this.editor.getJSON(),
        });
        const blob = new Blob([data], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, "export.json");
        return true;
      },

      uploadDocument: (file: Blob) => () => {
        if (!file) {
          return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const payload = JSON.parse(String(e.target.result));
            this.editor.commands.setContent(
              "content" in payload ? payload.content : undefined,
              true
            );
          }
        };
        reader.readAsText(file);
        return true;
      },
    };
  },
});
