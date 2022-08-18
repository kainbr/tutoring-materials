import type { TaskState } from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";
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
  conditions: object;
  data: object;
  label: Label;
};

export type EmittedEvent = {
  type: string;
  ts: number;
  label: Label;
  data: object;
};

/**
 * Helper
 */

export type Label = {
  message: string;
  data?: NamedValue;
  hexIcon?: string;
};
