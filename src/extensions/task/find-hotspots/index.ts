// noinspection JSUnusedGlobalSymbols

import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    taskFindHotspots: {
      /**
       * Adds a find the hotspot(s) task to the document.
       */
      setFindHotspotsTask: () => ReturnType;
    };
  }
}

export const TaskFindHotspots = BaseTask.extend({
  name: "task-find-hotspots",

  addAttributes() {
    return {
      ...this.parent?.(),
      type: "find-hotspots",
    };
  },

  addCommands() {
    return {
      setFindHotspotsTask:
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
                type: "find-hotspots",
              },
            })
            .focus()
            .run();

          return true;
        },
    };
  },
});
