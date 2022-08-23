import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";
import type { Feedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

export const formatFeedbacks: SCFormatFunction = function (data) {
  if (!Array.isArray(data.feedbacks) || !Array.isArray(data.content)) {
    data.feedbacks = [];
  } else {
    const answerOptions = data.content.map((option: SCOption) => option.id);
    data.feedbacks = data.feedbacks.filter((f: Feedback) => {
      return (
        f.type !== "feedback-hint" ||
        (!!(f as HintFeedback).config?.reference &&
          answerOptions.includes(<string>(f as HintFeedback).config.reference))
      );
    });
  }

  return data;
};
