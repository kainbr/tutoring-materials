// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskSingleChoice: {
      /**
       * Todo: Add method description
       */
      setSingleChoiceTask: () => ReturnType;
    };
  }
}

export const SingleChoiceTask = BaseTask.extend({
  addAttributes() {
    return { ...this.parent?.(), type: "single-choice" };
  },

  addCommands() {
    return {
      setSingleChoiceTask:
        () =>
        ({ commands }) => {
          commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
              },
            ],
            attrs: {
              type: "single-choice",
            },
          });

          commands.focus();

          return true;
        },
    };
  },
});
