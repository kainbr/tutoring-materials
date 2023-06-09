import { calculateHexIcon } from "@/helpers/util";

import type { STFormatFunction } from "@/extensions/task/short-text/types";
import type { EventCondition, EventOption } from "@/extensions/feedback/types";

const attempt: EventCondition = {
  fact: "attempt",
  label: {
    message: "global.condition.attempt"
  },
  type: "number",
  defaultOperation: "equal",
  defaultValue: 1
};

export const formatEvents: STFormatFunction = function(data) {
  const eventOption: EventOption = {
    name: "answer-submitted",
    parent: data.id,
    conditions: [attempt],
    label: {
      message: "global.event.type-answer-submitted",
      hexIcon: calculateHexIcon(data.id)
    }
  };

  data.events = [eventOption];

  return data;
};
