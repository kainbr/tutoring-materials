// noinspection JSUnusedGlobalSymbols

import { Extension } from "@tiptap/core";
import { calculateHexIcon } from "@/helpers/util";
import { v4 as uuid } from "uuid";

import type { Feedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    feedbackHint: {
      /**
       * Add a default hint feedback to to the document.
       */
      addFeedbackHint: (
        parent: string,
        reference: string,
        attributes: Partial<HintFeedback>
      ) => ReturnType;
    };
  }
}

export const FeedbackHint = Extension.create({
  name: "feedback-hint",

  addCommands() {
    return {
      addFeedbackHint:
        (parent, reference, attributes) =>
        ({ commands }) => {
          const defaultConfig = {
            reference: reference,
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
          const feedback: Feedback = {
            id: uid,
            type: this.name,
            label: {
              message: "global.feedback.type-feedback-hint",
              hexIcon: calculateHexIcon(uid),
            },
            parent: parent,
            config: defaultConfig,
          };

          commands.addFeedback({ ...feedback, ...attributes });

          return true;
        },
    };
  },
});
