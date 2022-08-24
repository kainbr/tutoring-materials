import type { JSONContent } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";

export interface NotificationFeedback extends Feedback {
  config: {
    content: JSONContent;
  };
}
