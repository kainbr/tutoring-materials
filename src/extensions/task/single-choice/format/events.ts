import { calculateHexIcon } from "@/helpers/util";

import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";
import type { EventCondition, EventOption } from "@/extensions/feedback/types";

export const formatEvents: SCFormatFunction = function (data) {
  const getOptionCorrect = (content: SCOption[]): EventCondition[] => {
    return content.map((option, index) => {
      return {
        fact: option.id + "-correct",
        label: {
          message: "global.condition.single-choice.answer-option-correct",
          data: { index: index + 1 },
        },
        previewLabel: {
          message: "global.condition.single-choice.answer-option-correct-preview",
          data: { index: index + 1 },
        },
        type: "boolean",
        defaultOperation: "equal",
        defaultValue: false,
        options: {
          trueLabel: "global.condition.single-choice.answer-option-correct-true",
          falseLabel: "global.condition.single-choice.answer-option-correct-false",
          equalLabel: "global.condition.single-choice.answer-option-correct-equal",
        },
      };
    });
  };

  const eventOption: EventOption = {
    name: "answer-submitted",
    parent: data.id,
    conditions: [...getOptionCorrect(data.content)],
    label: {
      message: "global.event.type-answer-submitted",
      hexIcon: calculateHexIcon(data.id),
    },
  };

  data.events = [eventOption];

  return data;
};
