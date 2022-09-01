import { isEqual } from "lodash-es";
import { provide, ref } from "vue";

import type { Ref } from "vue";
import type { Feedback } from "@/extensions/feedback/types";

export type InjectedFeedbacks = {
  activeFeedbacks: Ref<Feedback[]>;
  addActiveFeedback: (feedback: Feedback) => void;
  removeActiveFeedback: (feedback: Feedback) => void;
};

export default function (): InjectedFeedbacks {
  const activeFeedbacks: Ref<Feedback[]> = ref([]);

  function addActiveFeedback(feedback: Feedback) {
    const activeFeedback = activeFeedbacks.value.find((f: Feedback) => f.id === feedback.id);

    if (!activeFeedback) {
      activeFeedbacks.value = [...activeFeedbacks.value, feedback];
    }
  }

  function removeActiveFeedback(feedback: Feedback) {
    activeFeedbacks.value = activeFeedbacks.value.filter((f: Feedback) => !isEqual(f, feedback));
  }

  provide("feedbacks", {
    activeFeedbacks,
    addActiveFeedback,
    removeActiveFeedback,
  });

  return {
    activeFeedbacks,
    addActiveFeedback,
    removeActiveFeedback,
  };
}
