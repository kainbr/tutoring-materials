import type { TaskState } from "@/extensions/task/base/types";
import type { Feedback } from "@/extensions/feedback/types";

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
  data?: object;
  hexIcon?: string;
};
