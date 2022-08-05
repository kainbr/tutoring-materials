import type { JSONContent } from "@tiptap/vue-3";

// Tasks
export interface Task {
  id: string;
  type: string;
  answer: object;
}

// Scaffolds
export interface Scaffold {
  id?: string;
  type: string;
  parent: string | null;
  config: MarkScaffoldConfig | NotificationScaffoldConfig;
}

export interface MarkScaffold extends Scaffold {
  config: MarkScaffoldConfig;
}

export interface MarkScaffoldConfig {
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

export interface NotificationScaffold extends Scaffold {
  config: NotificationScaffoldConfig;
}

export interface NotificationScaffoldConfig {
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
  scaffoldIds: string[];
}
