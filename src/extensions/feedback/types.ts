export interface Feedback {
  id?: string;
  type: string;
  parent: string | null;
  config: object;
}

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
