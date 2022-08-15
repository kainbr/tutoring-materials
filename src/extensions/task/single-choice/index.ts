import { BaseTask } from "@/extensions/task/base";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    task: {
      /**
       * Todo
       */
      setSingleChoiceTask: () => ReturnType;
    };
  }
}

export const SingleChoiceTask = BaseTask.extend({
  name: "task-single-choice",

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
          });
          return true;
        },
    };
  },
});
