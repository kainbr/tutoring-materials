// noinspection JSUnusedGlobalSymbols

import { Extension } from "@tiptap/core";
import { calculateHexIcon } from "@/helpers/util";
import { v4 as uuid } from "uuid";

import type { StoredFeedback } from "@/extensions/feedback/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedbackNotification: {
      /**
       * Add a default notification feedback to permanent feedback store.
       */
      addFeedbackNotification: (attributes: object) => ReturnType;
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
          const defaults = {
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

          const uid = uuid();
          const feedback: StoredFeedback = {
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
