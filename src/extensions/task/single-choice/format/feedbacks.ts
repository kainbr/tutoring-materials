import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";
import type { Feedback, StoredFeedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

export const formatFeedbacks: SCFormatFunction<StoredFeedback[]> = function ({
  newContent,
  newFeedbacks,
}) {
  if (!Array.isArray(newFeedbacks) || !Array.isArray(newContent)) {
    return [];
  } else {
    const answerOptions = newContent.map((option: SCOption) => option.id);
    newFeedbacks = newFeedbacks.filter((f: Feedback) => {
      return (
        f.type !== "feedback-hint" ||
        (!!(f as HintFeedback).config?.reference &&
          answerOptions.includes(<string>(f as HintFeedback).config.reference))
      );
    });
    return newFeedbacks;
  }
};
