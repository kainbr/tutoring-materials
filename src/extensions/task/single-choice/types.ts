import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/base/types";
import type { Feedback } from "@/extensions/feedback/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { formatFunction } from "@/extensions/task/base/types";

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

// Feedbacks
export type SCFeedback = Feedback;

// State
export interface SCState extends TaskState {
  answer: SCOptionAnswer[];
  order: number[];
}

export interface SCOptionAnswer {
  id: string;
  value: boolean;
}

export type SCFormatFunction<T> = formatFunction<
  SCOption[],
  SCEvaluation,
  SCFeedback[],
  SCOptions,
  SCState,
  T
>;
