import type { SCFormatFunction } from "@/extensions/task/single-choice/types";

export const formatTriggers: SCFormatFunction = function (data) {
  if (!data.newTriggers) {
    data.newTriggers = [];
  }

  return data;
};
