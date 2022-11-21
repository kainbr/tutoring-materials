import type { MAPFormatFunction } from "@/extensions/task/mapping/types";
import type { MAPEvaluationOption } from "@/extensions/task/mapping/types";

export const formatEvaluation: MAPFormatFunction = function (data) {
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

  data.evaluation.solution = data.evaluation.solution.filter(
    (solution) =>
      !!solution.source &&
      !!data.content.source.find((o) => o.id === solution.source) &&
      !!solution.target &&
      !!data.content.target.find((o) => o.id === solution.target)
  );

  // Make sure that one option is always correct
  if (data.evaluation.solution.length === 0) {
    data.evaluation.solution.push({
      source: data.content.source[0].id,
      target: data.content.target[0].id,
    });
  }

  return data;
};

const defaultEvaluation = {
  name: "all-match",
  solution: [],
};

export const evaluationOptions: MAPEvaluationOption[] = [
  {
    name: "all-match",
    label: {
      message: "editor.task.mapping.evaluation-all-match",
    },
    config: [],
    default: {},
  },
];
