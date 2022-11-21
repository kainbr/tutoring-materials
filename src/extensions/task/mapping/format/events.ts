import { calculateHexIcon } from "@/helpers/util";

import type { MAPFormatFunction } from "@/extensions/task/mapping/types";
import type { EventCondition, EventOption } from "@/extensions/feedback/types";

const attempt: EventCondition = {
  fact: "attempt",
  label: {
    message: "global.condition.attempt",
  },
  type: "number",
  defaultOperation: "equal",
  defaultValue: 1,
};

const empty: EventCondition = {
  fact: "empty",
  label: {
    message: "global.condition.empty",
  },
  previewLabel: {
    message: "global.condition.empty-preview",
  },
  type: "boolean",
  defaultOperation: "equal",
  defaultValue: false,
  options: {
    trueLabel: "global.condition.empty-correct",
    falseLabel: "global.condition.empty-incorrect",
    equalLabel: "global.condition.is",
    unequalLabel: "global.condition.is-not",
  },
};

export const formatEvents: MAPFormatFunction = function (data) {
  const eventOption: EventOption = {
    name: "answer-submitted",
    parent: data.id,
    conditions: [attempt, empty],
    label: {
      message: "global.event.type-answer-submitted",
      hexIcon: calculateHexIcon(data.id),
    },
  };

  data.events = [eventOption];

  return data;
};
