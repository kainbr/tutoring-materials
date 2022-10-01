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

export interface FTBProps {
  id: string;
  editor: Editor;
  options: FTBOptions;
  content: FTBContent;
  evaluation: FTBEvaluation;
  state: FTBState;
}

export interface FTBEmits {
  (
    e: "update",
    task: {
      options: FTBOptions;
      content: FTBContent;
      evaluation: FTBEvaluation;
      state: FTBState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export type FTBContent = JSONContent;

// Evaluation
export interface FTBEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    options: { id: string; value: boolean }[];
  }[];
}

export type FTBEvaluationOption = TaskEvaluationOption;

// Option
export interface FTBOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface FTBState extends TaskState {
  answer: {
    id: string;
    value: string | null;
  }[];
}

export type FTBFormatFunction = (
  data: propsInterface<FTBOptions, FTBContent, FTBEvaluation, FTBState>
) => propsInterface<FTBOptions, FTBContent, FTBEvaluation, FTBState>;
