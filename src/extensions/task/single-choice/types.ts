import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";
import type { JSONContent } from "@tiptap/vue-3";
import type {} from "@/extensions/task/types";
import type { propsInterface } from "@/extensions/task/helpers";

// Content
export interface SCOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface SCEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type SCEvaluationOption = TaskEvaluationOption;

// Option
export interface SCOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface SCState extends TaskState {
  answer: SCOptionAnswer[];
  order: number[];
}

export interface SCOptionAnswer {
  id: string;
  value: boolean;
}

export type SCFormatFunction<T> = (
  data: propsInterface<SCOptions, SCOption[], SCEvaluation, SCState>
) => T;
