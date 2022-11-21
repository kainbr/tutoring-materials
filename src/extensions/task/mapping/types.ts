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
  content: MAPContent;
  evaluation: MAPEvaluation;
  state: MAPState;
}

export interface MAPEmits {
  (
    e: "update",
    task: {
      options: MAPOptions;
      content: MAPContent;
      evaluation: MAPEvaluation;
      state: MAPState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface MAPContent {
  source: MAPOption[];
  target: MAPOption[];
}

export interface MAPOption {
  id: string;
  content: JSONContent;
}

// Evaluation
export interface MAPEvaluation extends TaskEvaluation {
  solution: {
    source: string;
    target: string;
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
}

export interface MAPOptionAnswer {
  source: string;
  target: string;
}

export type MAPFormatFunction = (
  data: propsInterface<MAPOptions, MAPContent, MAPEvaluation, MAPState>
) => propsInterface<MAPOptions, MAPContent, MAPEvaluation, MAPState>;
