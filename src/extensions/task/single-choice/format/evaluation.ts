import type { SCFormatFunction, SCEvaluation } from "@/extensions/task/single-choice/types";
import type { SCEvaluationOption } from "@/extensions/task/single-choice/types";

export const formatEvaluation: SCFormatFunction = function (data) {
  switch (data.newEvaluation?.name) {
    case "all-match":
    default:
      data.newEvaluation = {
        ...{
          name: "all-match",
          solution: [],
        },
        ...data.newEvaluation,
      };
      break;
  }

  // Check if true values are supplied
  if (!!data.newContent && Array.isArray(data.newContent)) {
    data.newEvaluation.solution = data.newContent.map((option) => {
      const oldValue = data.newEvaluation?.solution.find((s) => s.id === option.id)?.value;
      return {
        id: option.id,
        value: oldValue ? oldValue : false,
      };
    });
  }

  // Make sure that one option is always correct
  if (
    data.newEvaluation.solution.length > 0 &&
    data.newEvaluation.solution.every((option) => !option.value)
  ) {
    data.newEvaluation.solution[0].value = true;
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
