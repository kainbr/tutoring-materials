// noinspection JSUnusedGlobalSymbols

import mitt from "mitt";
import { mergeAttributes, Node } from "@tiptap/core";
import { saveAs } from "file-saver";

import type { Emitter } from "mitt";
import type { Event } from "@/extensions/document/types";

export interface DocumentStorage {
  eventBus: () => Emitter<Event> | null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    document: {
      /**
       * Downloads a json file with the current content of the document. The current state is not saved.
       */
      saveDocument: () => ReturnType;
      /**
       * Reads in a task from a json file. Only the content of the task is read in and no state.
       */
      uploadDocument: (file: Blob) => ReturnType;
    };
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const Document = Node.create<{}, DocumentStorage>({
  name: "document",

  group: "block",

  content: "block+",

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
    const eventBus = mitt<Event>();
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
        const blob = new Blob(
          [
            JSON.stringify({
              content: this.editor.getJSON(),
            }),
          ],
          {
            type: "application/json;charset=utf-8",
          }
        );
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
