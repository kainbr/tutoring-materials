// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskShortText: {
      /**
       * Adds a short text task to the document.
       */
      setShortTextTask: () => ReturnType;
    };
  }
}

export const TaskShortText = BaseTask.extend({
  name: "task-short-text",

  addAttributes() {
    return { ...this.parent?.(), type: "short-text" };
  },

  addCommands() {
    return {
      setShortTextTask:
        () =>
          ({ chain }) => {
            chain()
              .insertContent({
                type: this.name,
                content: [
                  {
                    type: "paragraph"
                  }
                ],
                attrs: {
                  type: "short-text"
                }
              })
              .focus()
              .run();

            return true;
          }
    };
  }
});
