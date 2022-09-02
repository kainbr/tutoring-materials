// noinspection JSUnusedGlobalSymbols

import { Extension } from "@tiptap/core";
import { calculateHexIcon } from "@/helpers/util";
import { v4 as uuid } from "uuid";

import type { Feedback } from "@/extensions/feedback/types";
import type { NotificationFeedback } from "@/extensions/feedback/notification/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedbackNotification: {
      /**
       * Add a notification feedback to the document..
       */
      addFeedbackNotification: (attributes: Partial<NotificationFeedback>) => ReturnType;
    };
  }
}

export const FeedbackNotification = Extension.create({
  name: "feedback-notification",

  addCommands() {
    return {
      addFeedbackNotification:
        (attributes) =>
        ({ commands }) => {
          const defaultConfig = {
            content: {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Hello world!",
                    },
                  ],
                },
              ],
            },
          };

          const uid = !attributes.id ? uuid() : attributes.id;
          const feedback: Feedback = {
            id: uid,
            type: this.name,
            label: {
              message: "global.feedback.type-feedback-notification",
              hexIcon: calculateHexIcon(uid),
            },
            parent: null,
            config: defaultConfig,
          };

          commands.addFeedback({ ...feedback, ...attributes });

          return true;
        },
    };
  },
});
