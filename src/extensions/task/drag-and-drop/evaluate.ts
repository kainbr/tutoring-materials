// noinspection JSUnusedGlobalSymbols

import type { DNDEvaluation, DNDState } from "@/extensions/task/drag-and-drop/types";

export const evaluate = function (config: DNDEvaluation, state: DNDState): boolean {
  switch (config.name) {
    case "all-match":
      return false;
  }
  return false;
};

export const geDNDacts = function (config: DNDEvaluation, state: DNDState): object {
  return {};
};
