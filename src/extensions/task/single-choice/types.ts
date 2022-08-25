import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/types";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { propsInterface } from "@/extensions/task/helpers";
import type { Editor } from "@tiptap/vue-3";

export interface SCProps {
  id: string;
  editor: Editor;
  options?: SCOptions;
  content?: SCOption[];
  evaluation?: SCEvaluation;
  state?: SCState;
  feedbacks?: Feedback[];
  triggers?: EventTrigger[];
}

export interface SCEmits {
  (
    e: "update",
    task: {
      options?: SCOptions;
      content?: SCOption[];
      evaluation?: SCEvaluation;
      state?: SCState;
      feedbacks?: Feedback[];
      triggers?: EventTrigger[];
    }
  ): void;
  (e: "submit"): void;
}

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

export type SCFormatFunction = (
  data: propsInterface<SCOptions, SCOption[], SCEvaluation, SCState>
) => propsInterface<SCOptions, SCOption[], SCEvaluation, SCState>;
