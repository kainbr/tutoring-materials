import type { Editor } from "@tiptap/vue-3";
import type { StoredFeedback } from "@/extensions/feedback/types";

export interface TaskProps {
  id: string;
  editor: Editor;
  content?: TaskContent;
  evaluation?: TaskEvaluation;
  feedbacks?: StoredFeedback;
  options?: TaskOptions;
  state?: TaskState;
}

export interface TaskEmits {
  (e: "update:content", content: unknown): void;
  (e: "update:evaluation", evaluation: unknown): void;
  (e: "update:feedbacks", feedbacks: unknown): void;
  (e: "update:options", options: unknown): void;
  (e: "update:state", options: unknown): void;
  (e: "update", task: unknown): void;
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

export interface formatFunction<C, E, F, O, S, T> {
  (data: {
    id: string;
    newContent?: C;
    newEvaluation?: E;
    newFeedbacks?: F;
    newOptions?: O;
    newState?: S;
    oldContent?: C;
    oldEvaluation?: E;
    oldFeedbacks?: F;
    oldOptions?: O;
    oldState?: S;
  }): T;
}
