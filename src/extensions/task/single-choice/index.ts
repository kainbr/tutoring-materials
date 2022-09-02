// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskSingleChoice: {
      /**
       * Adds a single choice task to the document.
       */
      setSingleChoiceTask: () => ReturnType;
    };
  }
}

export const TaskSingleChoice = BaseTask.extend({
  addAttributes() {
    return { ...this.parent?.(), type: "single-choice" };
  },

  addCommands() {
    return {
      setSingleChoiceTask:
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
                type: "single-choice",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
