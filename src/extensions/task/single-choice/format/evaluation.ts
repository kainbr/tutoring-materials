import type { SCFormatFunction } from "@/extensions/task/single-choice/types";
import type { SCEvaluationOption } from "@/extensions/task/single-choice/types";

export const formatEvaluation: SCFormatFunction = function (data) {
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

  // Add the
  data.evaluation.solution = data.content.map((option) => {
    return {
      id: option.id,
      value: !!data.evaluation.solution.find((s) => s.id === option.id)?.value,
    };
  });

  // Make sure that one option is always correct
  if (
    data.evaluation.solution.length > 0 &&
    data.evaluation.solution.every((option) => !option.value)
  ) {
    data.evaluation.solution[0].value = true;
  }

  return data;
};

const defaultEvaluation = {
  name: "all-match",
  solution: [],
};

export const evaluationOptions: SCEvaluationOption[] = [
  {
    name: "all-match",
    config: [],
    default: {},
  },
];
