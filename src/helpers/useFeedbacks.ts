import { isEqual } from "lodash-es";
import { provide, ref } from "vue";

import type { Ref } from "vue";
import type { EventOption, Feedback } from "@/extensions/feedback/types";

export type ProvidedFeedbacks = {
  activeFeedbacks: Ref<Feedback[]>;
  eventOptions: Ref<EventOption[]>;
  addActiveFeedback: (feedback: Feedback) => void;
  removeActiveFeedback: (feedback: Feedback) => void;
};

export default function (): ProvidedFeedbacks {
  const activeFeedbacks: Ref<Feedback[]> = ref([]);
  const eventOptions: Ref<EventOption[]> = ref([]);

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
    eventOptions,
    addActiveFeedback,
    removeActiveFeedback,
  });

  return {
    activeFeedbacks,
    eventOptions,
    addActiveFeedback,
    removeActiveFeedback,
  };
}
