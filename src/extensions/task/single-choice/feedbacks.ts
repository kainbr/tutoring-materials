import type { SCFormatFunction, SCFeedback } from "@/extensions/task/single-choice/types";

export const formatFeedbacks: SCFormatFunction<SCFeedback[]> = function ({ newFeedbacks }) {
  if (!Array.isArray(newFeedbacks)) {
    return [];
  } else {
    return newFeedbacks.map((f) => f);
  }
};
