import { Extension } from "@tiptap/core";
import type { Feedback } from "@/extensions/feedback/types";
import { calculateHexIcon } from "@/helpers/util";
import { v4 as uuid } from "uuid";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedbackNotification: {
      /**
       *
       */
      addFeedbackNotification: (attributes: object) => ReturnType;
    };
  }
}

// This notification is only used to add commands to the editor instance.
// See feedbacks/notification/NotificationComponent.vue and
// feedbacks/notification/NotificationContainerComponent.vue for more information
export const FeedbackNotification = Extension.create({
  name: "feedback-notification",

  addCommands() {
    return {
      addFeedbackNotification:
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

          const uid = uuid();
          const feedback: Feedback = {
            id: uid,
            type: this.name,
            label: {
              message: "global.feedback.type-feedback-notification",
              hexIcon: calculateHexIcon(uid),
            },
            parent: null,
            config: { ...defaults, ...attributes },
          };
          commands.addFeedback(feedback);
          return true;
        },
    };
  },
});
