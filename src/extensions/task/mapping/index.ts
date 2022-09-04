// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskMapping: {
      /**
       * Adds a mapping task to the document.
       */
      setMappingTask: () => ReturnType;
    };
  }
}

export const TaskMapping = BaseTask.extend({
  name: "task-mapping",

  addAttributes() {
    return { ...this.parent?.(), type: "mapping" };
  },

  addCommands() {
    return {
      setMappingTask:
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
                type: "mapping",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
