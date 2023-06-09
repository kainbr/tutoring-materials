// noinspection JSUnusedGlobalSymbols

import type { STEvaluation, STState } from "@/extensions/task/short-text/types";

export const evaluate = function(config: STEvaluation, state: STState): boolean {
  switch (config.name) {
    case "always-correct":
      return true;
  }
  return false;
};

export const getFacts = function(config: STEvaluation, state: STState): object {
  return {};
};
