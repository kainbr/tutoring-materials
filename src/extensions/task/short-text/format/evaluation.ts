import type { STFormatFunction } from "@/extensions/task/short-text/types";
import type { STEvaluationOption } from "@/extensions/task/short-text/types";

export const formatEvaluation: STFormatFunction = function(data) {
  if (!data.evaluation?.name) {
    data.evaluation = defaultEvaluation;
  }

  // Set default values for the specified evaluation
  switch (data.evaluation.name) {
    case "click-one-correct":
    default:
      data.evaluation = {
        ...{
          name: "always-correct",
          solution: []
        },
        ...data.evaluation
      };
  }

  return data;
};

const defaultEvaluation = {
  name: "always-correct",
  solution: []
};

export const evaluationOptions: STEvaluationOption[] = [
  {
    name: "always-correct",
    label: {
      message: "editor.task.short-text.evaluation-always-correct"
    },
    config: [],
    default: {}
  }
];
