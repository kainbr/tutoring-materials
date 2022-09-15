import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/types";
import type { propsInterface } from "@/extensions/task/helpers";
import type { Editor } from "@tiptap/vue-3";
import type { EventOption } from "@/extensions/feedback/types";
import type { ListOption } from "@/extensions/task/helpers/listOptions";

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
export type TFOption = ListOption;

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
  trueLabel: string;
  falseLabel: string;
}

// State
export interface TFState extends TaskState {
  answer: TFOptionAnswer[];
  order: number[];
}

export interface TFOptionAnswer {
  id: string;
  value: boolean | null;
}

export type TFFormatFunction = (
  data: propsInterface<TFOptions, TFOption[], TFEvaluation, TFState>
) => propsInterface<TFOptions, TFOption[], TFEvaluation, TFState>;
