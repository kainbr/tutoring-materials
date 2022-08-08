import type { JSONContent } from "@tiptap/vue-3";

// Tasks
export interface Task {
  id: string;
  type: string;
  answer: object;
}

// Feedbacks
export interface Feedback {
  id?: string;
  type: string;
  parent: string | null;
  config: MarkFeedbackConfig | NotificationFeedbackConfig;
}

export interface MarkFeedback extends Feedback {
  config: MarkFeedbackConfig;
}

export interface MarkFeedbackConfig {
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
}

export interface NotificationFeedback extends Feedback {
  config: NotificationFeedbackConfig;
}

export interface NotificationFeedbackConfig {
  content: JSONContent;
}

// Events
export type Event = {
  type: string;
  ts: number;
  data: object;
};

export interface EventOption {
  name: string;
  conditions: {
    name: string;
    type: "boolean" | "number" | "string";
  }[];
}

export interface EventTrigger {
  id?: string;
  event: string | null;
  conditions: EventOption[];
  feedbackIds: string[];
}
