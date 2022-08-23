import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger, StoredFeedback } from "@/extensions/feedback/types";

export interface TaskProps<
  O extends TaskOptions,
  C extends TaskContent,
  E extends TaskEvaluation,
  S extends TaskState
> {
  id: string;
  editor: Editor;
  options?: O;
  content?: C;
  evaluation?: E;
  state?: S;
  feedbacks?: StoredFeedback[];
  triggers?: EventTrigger[];
}

export interface TaskEmits<O, C, E, S> {
  (e: "update:options", options: O): void;
  (e: "update:content", content: C): void;
  (e: "update:evaluation", evaluation: E): void;
  (e: "update:state", state: S): void;
  (e: "update:feedbacks", feedbacks: StoredFeedback[]): void;
  (e: "update:triggers", triggers: EventTrigger[]): void;
  (
    e: "update",
    task: {
      options?: O;
      content?: C;
      evaluation?: E;
      state?: S;
      feedbacks?: StoredFeedback[];
      triggers?: EventTrigger[];
    }
  ): void;
  (e: "submit"): void;
}

export interface TaskOptions {
  allowEmptyAnswerSubmission: boolean;
  hasMaxAttempts: boolean;
  maxAttempts: number;
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
}
