import type { SCFormatFunction } from "@/extensions/task/single-choice/types";
import type { EventTrigger, StoredFeedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import { isEqual, pick } from "lodash-es";
import { v4 as uuid } from "uuid";

export const formatTriggers: SCFormatFunction = function (data) {
  if (!data.triggers || !Array.isArray(data.triggers)) {
    data.triggers = <EventTrigger[]>[];
  }

  // Add event triggers for feedback hints
  data.feedbacks?.forEach((f: StoredFeedback) => {
    if (f.type === "feedback-hint") {
      const trigger: EventTrigger = {
        id: uuid(),
        event: "answer-submitted",
        parent: data.id,
        conditions: [
          {
            fact: (f as HintFeedback).config.reference + "-correct",
            operation: "equal",
            value: false,
          },
        ],
        feedbacks: [f.id],
      };

      const eventTrigger = (data.triggers as EventTrigger[]).find((t: EventTrigger) =>
        isEqual(
          pick(t, ["event", "parent", "conditions", "feedbacks"]),
          pick(trigger, ["event", "parent", "conditions", "feedbacks"])
        )
      );

      if (!eventTrigger) {
        data.triggers = [...(<EventTrigger[]>data.triggers), trigger];
      }
    }
  });

  // Filter out event triggers for feedback hints that do not have a corresponding option anymore
  data.triggers = [
    ...data.triggers.map((t: EventTrigger) => {
      return {
        ...t,
        feedbacks: t.feedbacks.filter((id) => {
          return data.feedbacks?.find((feedback: StoredFeedback) => feedback.id === id);
        }),
      };
    }),
  ];

  return data;
};
