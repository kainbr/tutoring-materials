import { findGaps } from "@/extensions/task/fill-the-blank/format/helpers";

import type { FTBFormatFunction } from "@/extensions/task/fill-the-blank/types";
import type { FTBEvaluationOption } from "@/extensions/task/fill-the-blank/types";

export const formatEvaluation: FTBFormatFunction = function (data) {
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

  data.evaluation.solution = findGaps(data.content).map((g) => {
    const solution = data.evaluation.solution.find((s) => s.id === g.attrs?.id);
    const gap = {
      id: g.attrs?.id,
      options: g.attrs?.options.map((o: { id: string; value: boolean }) => {
        return {
          id: o.id,
          value: !solution ? false : !!solution.options.find((f) => f.id === o.id)?.value,
        };
      }),
    };

    // At least one option needs to be correct
    if (gap.options.every((o: { id: string; value: boolean }) => !o.value)) {
      gap.options = gap.options.map((o: { id: string; value: boolean }, index: number) => {
        return { ...o, value: index === 0 };
      });
    }

    return gap;
  });

  return data;
};

const defaultEvaluation = {
  name: "all-match",
  solution: [],
};

export const evaluationOptions: FTBEvaluationOption[] = [
  {
    name: "all-match",
    label: {
      message: "editor.task.single-choice.evaluation-all-match",
    },
    config: [],
    default: {},
  },
];
