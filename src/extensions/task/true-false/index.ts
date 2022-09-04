// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskTrueFalse: {
      /**
       * Adds a true false task to the document.
       */
      setTrueFalseTask: () => ReturnType;
    };
  }
}

export const TaskTrueFalse = BaseTask.extend({
  name: "task-true-false",

  addAttributes() {
    return { ...this.parent?.(), type: "true-false" };
  },

  addCommands() {
    return {
      setTrueFalseTask:
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
                type: "true-false",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
