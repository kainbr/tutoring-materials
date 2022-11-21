// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import type { MAPEvaluation, MAPState } from "@/extensions/task/mapping/types";

export const evaluate = function (config: MAPEvaluation, state: MAPState): boolean {
  switch (config.name) {
    case "all-match":
      // Sort arrays by source id and then compare their JSON string.
      return (
        JSON.stringify(
          config.solution.sort((a, b) => {
            return a.source > b.source ? 1 : b.source > a.source ? -1 : 0;
          })
        ) ===
        JSON.stringify(
          state.answer.sort((a, b) => {
            return a.source > b.source ? 1 : b.source > a.source ? -1 : 0;
          })
        )
      );
  }
  return false;
};

export const getFacts = function (config: MAPEvaluation, state: MAPState): object {
  return {};
};
