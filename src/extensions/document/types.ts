import type { TaskState } from "@/extensions/task/types";
import type { EventFacts, Feedback } from "@/extensions/feedback/types";
import type { NamedValue } from "vue-i18n";

export interface DocumentState {
  tasks: TaskState[];
  feedbacks: Feedback[];
}

/**
 * Events
 */

export type Event = {
  type: string;
  parent: string | null;
  facts: EventFacts;
  data: object;
  label: Label;
};

export type EmittedEvent = {
  type: string;
  ts: number;
  facts: EventFacts;
  data: object;
  label: Label;
};

/**
 * Helper
 */

export type Label = {
  message: string;
  data?: NamedValue;
  hexIcon?: string;
};
