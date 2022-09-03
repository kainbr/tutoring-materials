import type { MCFormatFunction } from "@/extensions/task/multiple-choice/types";
import type { MCEvaluationOption } from "@/extensions/task/multiple-choice/types";

export const formatEvaluation: MCFormatFunction = function (data) {
  if (!data.evaluation?.name) {
    data.evaluation = defaultEvaluation;
  }

  // Set default values for the specified evaluation
  switch (data.evaluation.name) {
    case "all-match":
    default:
      data.evaluation = {
        ...{
          name: "all-match",
          solution: [],
        },
        ...data.evaluation,
      };
  }

  data.evaluation.solution = data.content.map((option) => {
    return {
      id: option.id,
      value: !!data.evaluation.solution.find((s) => s.id === option.id)?.value,
    };
  });

  return data;
};

const defaultEvaluation = {
  name: "all-match",
  solution: [],
};

export const evaluationOptions: MCEvaluationOption[] = [
  {
    name: "all-match",
    label: {
      message: "editor.task.multiple-choice.evaluation-all-match",
    },
    config: [],
    default: {},
  },
];
