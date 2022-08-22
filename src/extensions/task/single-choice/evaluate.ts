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

export const formatConditions = function (config: SCEvaluation, state: SCState): object {
  return {
    // option values
    ...state.answer.reduce((a, o) => ({ ...a, ["option-" + o.id + "-value"]: o.value }), {}),
    // option correctness
    ...state.answer.reduce(
      (a, o) => ({
        ...a,
        ["option-" + o.id + "-correct"]:
          o.value === config.solution.find((a) => a.id === o.id)?.value,
      }),
      {}
    ),
  };
};
