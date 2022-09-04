// noinspection JSUnusedGlobalSymbols

import type { TFEvaluation, TFState } from "@/extensions/task/true-false/types";

export const evaluate = function (config: TFEvaluation, state: TFState): boolean {
  switch (config.name) {
    case "all-match":
      return false;
  }
  return false;
};

export const getFacts = function (config: TFEvaluation, state: TFState): object {
  return {};
};
