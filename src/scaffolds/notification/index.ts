import { Extension } from "@tiptap/core";
import type { Scaffold } from "@/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    scaffoldNotification: {
      /**
       *
       */
      addScaffoldNotification: (attributes: object) => ReturnType;
    };
  }
}

// This notification is only used to add commands to the editor instance.
// See scaffolds/notification/NotificationComponent.vue and
// scaffolds/notification/NotificationContainerComponent.vue for more information
export const ScaffoldNotification = Extension.create({
  name: "scaffold-notification",

  addCommands() {
    return {
      addScaffoldNotification:
        (attributes) =>
        ({ commands }) => {
          const defaults = {
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Lorem ipsum",
                    },
                  ],
                },
              ],
            },
          };

          const scaffold: Scaffold = {
            type: this.name,
            parent: null,
            config: { ...defaults, ...attributes },
          };
          commands.addScaffold(scaffold);
          return true;
        },
    };
  },
});
