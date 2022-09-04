// noinspection JSUnusedGlobalSymbols

import type { FTBEvaluation, FTBState } from "@/extensions/task/fill-the-blank/types";

export const evaluate = function (config: FTBEvaluation, state: FTBState): boolean {
  switch (config.name) {
    case "all-match":
      return false;
  }
  return false;
};

export const geFTBacts = function (config: FTBEvaluation, state: FTBState): object {
  return {};
};
