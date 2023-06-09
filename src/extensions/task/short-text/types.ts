import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState
} from "@/extensions/task/types";
import type { propsInterface } from "@/extensions/task/helpers";
import type { Editor } from "@tiptap/vue-3";
import type { EventOption } from "@/extensions/feedback/types";

export interface STProps {
  id: string;
  editor: Editor;
  options: STOptions;
  content: STContent;
  evaluation: STEvaluation;
  state: STState;
}

export interface STEmits {
  (
    e: "update",
    task: {
      options: STOptions;
      content: STContent;
      evaluation: STEvaluation;
      state: STState;
      events: EventOption[];
    }
  ): void;

  (e: "submit"): void;
}

// Content
export interface STContent {
}

// Evaluation
export interface STEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: string;
  }[];
}

export type STEvaluationOption = TaskEvaluationOption;

// Option
export interface STOptions extends TaskOptions {
}

// State
export interface STState extends TaskState {
  answer: string | null;
}

export type STFormatFunction = (
  data: propsInterface<STOptions, STContent, STEvaluation, STState>
) => propsInterface<STOptions, STContent, STEvaluation, STState>;
