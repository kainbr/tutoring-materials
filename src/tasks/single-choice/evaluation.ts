import type { SCFormatFunction, SCEvaluation } from "@/tasks/single-choice/types";
import type { SCEvaluationOption } from "@/tasks/single-choice/types";

export const formatEvaluation: SCFormatFunction<SCEvaluation> = function ({
  newEvaluation,
  newContent,
}) {
  let evaluation: SCEvaluation = {
    name: "",
    solution: [],
  };

  switch (newEvaluation?.name) {
    case "all-match":
      evaluation = { ...evaluation, ...newEvaluation };
      break;
    default:
      evaluation = { ...evaluation, ...defaultEvaluation };
  }

  // Check if true values are supplied
  if (!!newContent && Array.isArray(newContent)) {
    evaluation.solution = newContent.map((option) => {
      const oldValue = newEvaluation?.solution.find((s) => s.id === option.id)?.value;
      return {
        id: option.id,
        value: !!oldValue ? oldValue : false,
      };
    });
  }

  // Make sure that one option is always correct
  if (evaluation.solution.length > 0 && evaluation.solution.every((option) => !option.value)) {
    evaluation.solution[0].value = true;
  }

  return evaluation;
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
