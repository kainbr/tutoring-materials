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

export interface FHProps {
  id: string;
  editor: Editor;
  options: FHOptions;
  content: FHOption[];
  evaluation: FHEvaluation;
  state: FHState;
}

export interface FHEmits {
  (
    e: "update",
    task: {
      options: FHOptions;
      content: FHOption[];
      evaluation: FHEvaluation;
      state: FHState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface FHOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface FHEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type FHEvaluationOption = TaskEvaluationOption;

// Option
export interface FHOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface FHState extends TaskState {
  answer: FHOptionAnswer[];
  order: number[];
}

export interface FHOptionAnswer {
  id: string;
  value: boolean;
}

export type FHFormatFunction = (
  data: propsInterface<FHOptions, FHOption[], FHEvaluation, FHState>
) => propsInterface<FHOptions, FHOption[], FHEvaluation, FHState>;
