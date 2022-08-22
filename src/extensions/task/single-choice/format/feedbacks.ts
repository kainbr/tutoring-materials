import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";
import type { NodeWithPos } from "@tiptap/vue-3";
import { findChildren } from "@tiptap/core";
import type { Feedback, StoredFeedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";

export const formatFeedbacks: SCFormatFunction<Feedback[]> = function ({
  newContent,
  newFeedbacks,
}) {
  if (!Array.isArray(newFeedbacks) || !Array.isArray(newContent)) {
    return [];
  } else {
    console.log("formatFeedbacks", newFeedbacks);
    const answerOptions = newContent.map((option: SCOption) => option.id);
    console.log("answerOptions", answerOptions);

    const hintFeedbacks: Feedback[] = newFeedbacks.filter(
      (f: Feedback) => f.type === "feedback-hint"
    );
    console.log("hintFeedbacks", hintFeedbacks);

    const hintFeedbackOptionsIds = hintFeedbacks.map(
      (f: Feedback) => (f as HintFeedback).config.reference
    );
    console.log("hintFeedbackOptionsIds", hintFeedbackOptionsIds);

    newFeedbacks = newFeedbacks.filter((f: Feedback) => {
      console.log(
        "newFeedbacks.filter",
        f.type,
        !!(f as HintFeedback).config?.reference,
        answerOptions.includes(<string>(f as HintFeedback).config.reference)
      );
      return (
        f.type !== "feedback-hint" ||
        (!!(f as HintFeedback).config?.reference &&
          answerOptions.includes(<string>(f as HintFeedback).config.reference))
      );
    });

    console.log("newFeedbacks", newFeedbacks);

    return newFeedbacks;
  }
};
