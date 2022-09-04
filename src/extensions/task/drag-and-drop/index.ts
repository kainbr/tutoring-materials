// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskDragAndDrop: {
      /**
       * Adds a drag and drop task to the document.
       */
      setDragAndDropTask: () => ReturnType;
    };
  }
}

export const TaskDragAndDrop = BaseTask.extend({
  name: "task-drag-and-drop",

  addAttributes() {
    return { ...this.parent?.(), type: "drag-and-drop" };
  },

  addCommands() {
    return {
      setDragAndDropTask:
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
                type: "drag-and-drop",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
