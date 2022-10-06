// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import type { FTBEvaluation, FTBState } from "@/extensions/task/fill-the-blank/types";

export const evaluate = function (config: FTBEvaluation, state: FTBState): boolean {
  console.log("evaluate gaps", config, state);

  switch (config.name) {
    case "all-match":
      return config.solution.every((option) => {
        const answer = state.answer.find((a) => a.id === option.id)?.value;
        if (!answer) return false;
        return !!option.options.find((o) => o.id === answer)?.value;
      });
  }
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFacts = function (config: FTBEvaluation, state: FTBState): object {
  return {};
};
