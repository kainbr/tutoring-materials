import type { Label } from "@/extensions/document/types";

/**
 * Feedback
 */

export interface Feedback {
  type: string;
  parent: string | null;
  config: object;
  ref?: string;
}

export interface StoredFeedback extends Feedback {
  id: string;
  label: Label;
}

/**
 * Triggers
 */

export type EventTrigger = {
  id: string;
  event: string;
  conditions: EventCondition[];
  feedbacks: string[];
  parent: string | null;
};

export type EventCondition = {
  name: string;
  variable: string;
  value: unknown;
};

export type EventOption = {
  name: string;
  label: Label;
  conditions: EventOptionCondition[];
  parent?: string;
};

export interface EventOptionCondition {
  name: string;
  variable: string;
  label: Label;
  type: string;
  default: unknown;
  editable: boolean;
}

export interface EventOptionConditionBoolean extends EventOptionCondition {
  type: "Boolean";
  default: boolean;
}

export interface EventOptionConditionNumber extends EventOptionCondition {
  type: "Number";
  default: number;
}

export interface EventOptionConditionString extends EventOptionCondition {
  type: "String";
  default: string;
}
