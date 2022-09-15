// noinspection JSUnusedGlobalSymbols

import type { TFEvaluation, TFState } from "@/extensions/task/true-false/types";

export const evaluate = function (config: TFEvaluation, state: TFState): boolean {
  switch (config.name) {
    case "all-match":
      return config.solution.every((option) => {
        return option.value === state.answer.find((a) => a.id === option.id)?.value;
      });
  }
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFacts = function (config: TFEvaluation, state: TFState): object {
  return {};
};
