// noinspection JSUnusedGlobalSymbols

import type { SCEvaluation, SCState } from "@/extensions/task/single-choice/types";

export const evaluate = function (config: SCEvaluation, state: SCState): boolean {
  switch (config.name) {
    case "all-match":
      return config.solution.every((option) => {
        return option.value === state.answer.find((a) => a.id === option.id)?.value;
      });
  }
  return false;
};

export const getFacts = function (config: SCEvaluation, state: SCState): object {
  return {
    ...state.answer.reduce((a, o) => ({ ...a, [o.id + "-selected"]: o.value }), {}),
  };
};
