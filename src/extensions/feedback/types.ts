export type Label = {
  message: string;
  data?: object;
  hexIcon?: string;
};

export interface Feedback {
  id?: string;
  label?: Label;
  type: string;
  parent: string | null;
  config: object;
}

export type Event = {
  type: string;
  ts: number;
  data: object;
};

export type EventTrigger = {
  id: string;
  event: string | null;
  conditions: EventCondition[];
  feedbacks: string[];
  parent?: string;
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
