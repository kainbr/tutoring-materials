import type { JSONContent } from "@tiptap/vue-3";
import type { StoredFeedback } from "@/extensions/feedback/types";

export interface NotificationFeedback extends StoredFeedback {
  config: {
    content: JSONContent;
  };
}
