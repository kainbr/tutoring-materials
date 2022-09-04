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

export interface MAPProps {
  id: string;
  editor: Editor;
  options: MAPOptions;
  content: MAPOption[];
  evaluation: MAPEvaluation;
  state: MAPState;
}

export interface MAPEmits {
  (
    e: "update",
    task: {
      options: MAPOptions;
      content: MAPOption[];
      evaluation: MAPEvaluation;
      state: MAPState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface MAPOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface MAPEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type MAPEvaluationOption = TaskEvaluationOption;

// Option
export interface MAPOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface MAPState extends TaskState {
  answer: MAPOptionAnswer[];
  order: number[];
}

export interface MAPOptionAnswer {
  id: string;
  value: boolean;
}

export type MAPFormatFunction = (
  data: propsInterface<MAPOptions, MAPOption[], MAPEvaluation, MAPState>
) => propsInterface<MAPOptions, MAPOption[], MAPEvaluation, MAPState>;
