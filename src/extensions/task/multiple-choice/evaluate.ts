// noinspection JSUnusedGlobalSymbols

import type { MCEvaluation, MCState } from "@/extensions/task/multiple-choice/types";

export const evaluate = function (config: MCEvaluation, state: MCState): boolean {
  switch (config.name) {
    case "all-match":
      return config.solution.every((option) => {
        return option.value === state.answer.find((a) => a.id === option.id)?.value;
      });
  }
  return false;
};

export const getFacts = function (config: MCEvaluation, state: MCState): object {
  return {
    ...state.answer.reduce((a, o) => ({ ...a, [o.id + "-selected"]: o.value }), {}),
  };
};
