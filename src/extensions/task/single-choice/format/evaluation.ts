import type { SCFormatFunction } from "@/extensions/task/single-choice/types";
import type { SCEvaluationOption } from "@/extensions/task/single-choice/types";

export const formatEvaluation: SCFormatFunction = function (data) {
  switch (data.evaluation?.name) {
    case "all-match":
    default:
      data.evaluation = {
        ...{
          name: "all-match",
          solution: [],
        },
        ...data.evaluation,
      };
      break;
  }

  // Check if true values are supplied
  if (!!data.content && Array.isArray(data.content)) {
    data.evaluation.solution = data.content.map((option) => {
      const oldValue = data.evaluation?.solution.find((s) => s.id === option.id)?.value;
      return {
        id: option.id,
        value: oldValue ? oldValue : false,
      };
    });
  }

  // Make sure that one option is always correct
  if (
    data.evaluation.solution.length > 0 &&
    data.evaluation.solution.every((option) => !option.value)
  ) {
    data.evaluation.solution[0].value = true;
  }

  return data;
};

export const defaultEvaluation = {
  name: "all-match",
};

export const evaluationOptions: SCEvaluationOption[] = [
  {
    name: "all-match",
    config: [],
    default: {},
  },
];
