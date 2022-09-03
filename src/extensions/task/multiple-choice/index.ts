// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskMultipleChoice: {
      /**
       * Adds a multiple choice task to the document.
       */
      setMultipleChoiceTask: () => ReturnType;
    };
  }
}

export const TaskMultipleChoice = BaseTask.extend({
  name: "task-multiple-choice",

  addAttributes() {
    return { ...this.parent?.(), type: "multiple-choice" };
  },

  addCommands() {
    return {
      setMultipleChoiceTask:
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
                type: "multiple-choice",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
