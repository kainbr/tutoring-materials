import type { JSONContent } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";

export interface HintFeedback extends Feedback {
  config: {
    reference?: string;
    content: JSONContent;
  };
}
