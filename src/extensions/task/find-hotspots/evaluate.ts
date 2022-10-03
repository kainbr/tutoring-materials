// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import type { FHEvaluation, FHState } from "@/extensions/task/find-hotspots/types";

export const evaluate = function (config: FHEvaluation, state: FHState): boolean {
  switch (config.name) {
    case "click-one-correct":
      const correctRegions = config.solution
        .filter((region) => region.value)
        .map((region) => region.id);

      for (const region of state.answer.clickedRegions as string[]) {
        if (correctRegions.includes(region)) return true;
      }

      return false;
  }
  return false;
};

export const getFacts = function (config: FHEvaluation, state: FHState): object {
  return {};
};
