import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";
import type { Feedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

export const formatFeedbacks: SCFormatFunction = function (data) {
  if (!Array.isArray(data.newFeedbacks) || !Array.isArray(data.newContent)) {
    data.newFeedbacks = [];
  } else {
    const answerOptions = data.newContent.map((option: SCOption) => option.id);
    data.newFeedbacks = data.newFeedbacks.filter((f: Feedback) => {
      return (
        f.type !== "feedback-hint" ||
        (!!(f as HintFeedback).config?.reference &&
          answerOptions.includes(<string>(f as HintFeedback).config.reference))
      );
    });
  }

  return data;
};
