import type { Label } from "@/extensions/document/types";

/**
 * Feedback
 */

export interface Feedback {
  id: string;
  type: string;
  parent: string | null;
  config: object;
  label?: Label;
}

/**
 * Triggers
 */

export type EventTrigger = {
  id: string;
  event: string | null;
  parent: string | null;
  rules: EventRule[];
  feedbacks: string[];
};

export type EventRule = {
  id: string;
  fact: string;
  operation: string;
  value: unknown;
};

export interface BooleanEventRule extends EventRule {
  value: boolean;
}

export interface NumberEventRule extends EventRule {
  value: number;
}

export type EventFacts = {
  [key: string]: unknown;
};

/**
 * An EventOption can be selected as the 'event' for an event trigger.
 */
export type EventOption = {
  name: string;
  parent: string | null;
  conditions: EventCondition[];
  label: Label;
};

/**
 * An EventOption specifies a condition that can be selected for a specific
 * event option. They are turned into an EventRule when selected.
 */
export type EventCondition = {
  fact: string;
  label: Label;
  previewLabel?: Label;
  type: "boolean" | "number";
  defaultOperation: string;
  defaultValue: unknown;
  options?: BooleanConditionOptions | NumberConditionOptions;
};

export type BooleanConditionOptions = {
  trueLabel?: string;
  falseLabel?: string;
  equalLabel?: string;
  unequalLabel?: string;
};

export type NumberConditionOptions = {
  min?: number;
  max?: number;
  step?: number;
};
