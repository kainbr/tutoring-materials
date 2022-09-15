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

export interface MCProps {
  id: string;
  editor: Editor;
  options: MCOptions;
  content: MCOption[];
  evaluation: MCEvaluation;
  state: MCState;
}

export interface MCEmits {
  (
    e: "update",
    task: {
      options: MCOptions;
      content: MCOption[];
      evaluation: MCEvaluation;
      state: MCState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export type MCOption = ListOption;

// Evaluation
export interface MCEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type MCEvaluationOption = TaskEvaluationOption;

// Option
export interface MCOptions extends TaskOptions {
  shuffle: boolean;
}

// State
export interface MCState extends TaskState {
  answer: MCOptionAnswer[];
  order: number[];
}

export interface MCOptionAnswer {
  id: string;
  value: boolean;
}

export type MCFormatFunction = (
  data: propsInterface<MCOptions, MCOption[], MCEvaluation, MCState>
) => propsInterface<MCOptions, MCOption[], MCEvaluation, MCState>;
