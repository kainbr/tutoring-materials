import type { Feedback } from "@/extensions/feedback/types";

export interface MarkFeedback extends Feedback {
  config: {
    ref: string;
    bold?: {
      weight?: number;
    };
    italic?: object;
    underline?: {
      color?: string;
      style?: string;
      thickness?: string;
    };
    highlight?: {
      color?: string;
    };
  };
}
