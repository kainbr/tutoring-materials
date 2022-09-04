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

export interface TFProps {
  id: string;
  editor: Editor;
  options: TFOptions;
  content: TFOption[];
  evaluation: TFEvaluation;
  state: TFState;
}

export interface TFEmits {
  (
    e: "update",
    task: {
      options: TFOptions;
      content: TFOption[];
      evaluation: TFEvaluation;
      state: TFState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface TFOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface TFEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type TFEvaluationOption = TaskEvaluationOption;

// Option
export interface TFOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface TFState extends TaskState {
  answer: TFOptionAnswer[];
  order: number[];
}

export interface TFOptionAnswer {
  id: string;
  value: boolean;
}

export type TFFormatFunction = (
  data: propsInterface<TFOptions, TFOption[], TFEvaluation, TFState>
) => propsInterface<TFOptions, TFOption[], TFEvaluation, TFState>;
