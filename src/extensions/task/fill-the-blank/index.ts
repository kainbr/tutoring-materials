// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskFillTheBlank: {
      /**
       * Adds a fill-in-the-blank task to the document.
       */
      setFillTheBlankTask: () => ReturnType;
    };
  }
}

export const TaskFillTheBlank = BaseTask.extend({
  name: "task-fill-the-blank",

  addAttributes() {
    return { ...this.parent?.(), type: "fill-the-blank" };
  },

  addCommands() {
    return {
      setFillTheBlankTask:
        () =>
        ({ chain }) => {
          chain()
            .insertContent({
              type: this.name,
              content: [
                {
                  type: "paragraph",
                },
              ],
              attrs: {
                type: "fill-the-blank",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
