import type { SCEvaluation, SCState } from "@/tasks/single-choice/types";

export const evaluate = function (config: SCEvaluation, state: SCState): boolean {
  switch (config.name) {
    case "all-match":
      return config.solution.every((option) => {
        return option.value === state.answer.find((a) => a.id === option.id)?.value;
      });
  }
  return false;
};
