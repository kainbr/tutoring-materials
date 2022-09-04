import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { propsInterface } from "@/extensions/task/helpers";
import type { Editor } from "@tiptap/vue-3";
import type { EventOption } from "@/extensions/feedback/types";

export interface DNDProps {
  id: string;
  editor: Editor;
  options: DNDOptions;
  content: DNDOption[];
  evaluation: DNDEvaluation;
  state: DNDState;
}

export interface DNDEmits {
  (
    e: "update",
    task: {
      options: DNDOptions;
      content: DNDOption[];
      evaluation: DNDEvaluation;
      state: DNDState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface DNDOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface DNDEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type DNDEvaluationOption = TaskEvaluationOption;

// Option
export interface DNDOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface DNDState extends TaskState {
  answer: DNDOptionAnswer[];
  order: number[];
}

export interface DNDOptionAnswer {
  id: string;
  value: boolean;
}

export type DNDFormatFunction = (
  data: propsInterface<DNDOptions, DNDOption[], DNDEvaluation, DNDState>
) => propsInterface<DNDOptions, DNDOption[], DNDEvaluation, DNDState>;
