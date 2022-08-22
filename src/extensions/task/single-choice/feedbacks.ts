import type { SCFormatFunction, SCFeedback } from "@/extensions/task/single-choice/types";

export const formatFeedbacks: SCFormatFunction<SCFeedback[]> = function ({ newFeedbacks }) {
  console.log("formatFeedbacks", newFeedbacks);

  if (!Array.isArray(newFeedbacks)) {
    return [];
  } else {
    return newFeedbacks.map((f) => f);
  }
};
