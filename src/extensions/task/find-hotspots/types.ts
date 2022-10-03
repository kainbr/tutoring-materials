import type {
  TaskEvaluation,
  TaskEvaluationOption,
  TaskOptions,
  TaskState,
} from "@/extensions/task/types";
import type { propsInterface } from "@/extensions/task/helpers";
import type { Editor } from "@tiptap/vue-3";
import type { EventOption } from "@/extensions/feedback/types";

export interface FHProps {
  id: string;
  editor: Editor;
  options: FHOptions;
  content: FHContent;
  evaluation: FHEvaluation;
  state: FHState;
}

export interface FHEmits {
  (
    e: "update",
    task: {
      options: FHOptions;
      content: FHContent;
      evaluation: FHEvaluation;
      state: FHState;
      events: EventOption[];
    }
  ): void;
  (e: "submit"): void;
}

// Content
export interface FHContent {
  img: string;
  regions: FHRegion[];
}

export type FHRegion = {
  id: string;
  type: string;
  config: RectRegion;
};

type RectRegion = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
};

// Evaluation
export interface FHEvaluation extends TaskEvaluation {
  solution: {
    id: string;
    value: boolean;
  }[];
}

export type FHEvaluationOption = TaskEvaluationOption;

// Option
export type FHOptions = TaskOptions;

// State
export interface FHState extends TaskState {
  answer: {
    position: {
      x: number;
      y: number;
    };
    clickedRegions: string[];
  };
}

export type FHFormatFunction = (
  data: propsInterface<FHOptions, FHContent, FHEvaluation, FHState>
) => propsInterface<FHOptions, FHContent, FHEvaluation, FHState>;
