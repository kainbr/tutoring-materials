import type { JSONContent } from "@tiptap/vue-3";
import type { StoredFeedback } from "@/extensions/feedback/types";

export interface HintFeedback extends StoredFeedback {
  config: {
    reference?: string;
    content: JSONContent;
  };
}
