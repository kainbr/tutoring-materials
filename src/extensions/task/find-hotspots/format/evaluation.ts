import type { FHFormatFunction } from "@/extensions/task/find-hotspots/types";
import type { FHEvaluationOption } from "@/extensions/task/find-hotspots/types";

export const formatEvaluation: FHFormatFunction = function (data) {
  if (!data.evaluation?.name) {
    data.evaluation = defaultEvaluation;
  }

  // Set default values for the specified evaluation
  switch (data.evaluation.name) {
    case "click-one-correct":
    default:
      data.evaluation = {
        ...{
          name: "click-one-correct",
          solution: [],
        },
        ...data.evaluation,
      };
  }

  data.evaluation.solution = data.content.regions.map((region) => {
    return {
      id: region.id,
      value: !!data.evaluation.solution.find((s) => s.id === region.id)?.value,
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
  name: "click-one-correct",
  solution: [],
};

export const evaluationOptions: FHEvaluationOption[] = [
  {
    name: "click-one-correct",
    label: {
      message: "editor.task.find-hotspots.evaluation-click-one-correct",
    },
    config: [],
    default: {},
  },
];
