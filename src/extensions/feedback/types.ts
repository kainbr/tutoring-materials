import type { Label } from "@/extensions/document/types";

/**
 * Feedback
 */

export interface Feedback {
  type: string;
  parent: string | null;
  config: object;
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
  parent: string | null;
  conditions: EventRule[];
  feedbacks: string[];
  removeIfEmpty?: boolean;
};

export type EventRule = {
  fact: string;
  operation: string;
  value: unknown;
};

export type EventOption = {
  name: string;
  label: Label;
  facts: EventOptionCondition[];
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
