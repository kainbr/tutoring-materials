import type { Editor } from "@tiptap/vue-3";
import type { EventOption } from "@/extensions/feedback/types";
import type { Label } from "@/extensions/document/types";

export interface TaskProps<
  O extends TaskOptions,
  C extends TaskContent,
  E extends TaskEvaluation,
  S extends TaskState
> {
  id: string;
  editor: Editor;
  options: O;
  content: C;
  evaluation: E;
  state: S;
}

export interface TaskEmits<O, C, E, S> {
  (
    e: "update",
    task: {
      options: O;
      content: C;
      evaluation: E;
      state: S;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

export interface TaskOptions {
  allowEmptyAnswerSubmission: boolean;
  hasMaxAttempts: boolean;
  maxAttempts: number;
  hasNextButton: boolean;
  hasFeedbackButton: boolean;
  hasDisabledCheckTimer: boolean;
  disabledCheckTimer: number;
  hasDisabledNextTimer: boolean;
  disabledNextTimer: number;
  textSubmitButton: string;
  titleCorrectAnswer: string;
  textCorrectAnswer: string;
  titleIncorrectAnswer: string;
  textIncorrectAnswer: string;
  titleFinalIncorrectAnswer: string;
  textFinalIncorrectAnswer: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TaskContent {}

export interface TaskEvaluation {
  name: string;
}

export interface TaskEvaluationOption {
  name: string;
  label: Label;
  config: {
    name: string;
    type: "boolean" | "number" | "string";
    default: boolean | number | string;
  }[];
  default: object;
}
export interface TaskState {
  id: string;
  state: string;
  attempt: number;
  type: string;
  answer: unknown;
  empty: boolean;
  disabledTimer?: number;
}
