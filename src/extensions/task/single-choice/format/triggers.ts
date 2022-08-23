import type { SCFormatFunction } from "@/extensions/task/single-choice/types";
import type { EventTrigger } from "@/extensions/feedback/types";

export const formatTriggers: SCFormatFunction<EventTrigger[]> = function ({ newTriggers }) {
  if (!newTriggers) {
    return [];
  } else {
    return newTriggers;
  }
};
