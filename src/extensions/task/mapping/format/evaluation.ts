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

  data.evaluation.solution = data.content.source.map((o) => {
    return {
      source: o.id,
      target: data.evaluation.solution?.find((a) => a.source === o.id)?.target || null,
    };
  });

  // Make sure that each start option has a target associated
  while (data.evaluation.solution.some((s) => !s.target)) {
    let targetIndex = data.evaluation.solution?.findIndex((a) => !a.target);
    data.evaluation.solution[targetIndex].target =
      data.content.target.find((t) => !data.evaluation.solution?.find((s) => s.target === t.id))
        ?.id || null;
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
