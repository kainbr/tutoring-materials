import { calculateHexIcon } from "@/helpers/util";

import type { MCFormatFunction, MCOption } from "@/extensions/task/multiple-choice/types";
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

const response: EventCondition = {
  fact: "response",
  label: {
    message: "global.condition.response",
  },
  previewLabel: {
    message: "global.condition.response-preview",
  },
  type: "boolean",
  defaultOperation: "equal",
  defaultValue: false,
  options: {
    trueLabel: "global.condition.response-correct",
    falseLabel: "global.condition.response-incorrect",
    equalLabel: "global.condition.is",
    unequalLabel: "global.condition.is-not",
  },
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

const getOptionSelected = (content: MCOption[]): EventCondition[] => {
  return content.map((option, index) => {
    return {
      fact: option.id + "-selected",
      label: {
        message: "global.condition.multiple-choice.answer-option-selected",
        data: { index: index + 1 },
      },
      previewLabel: {
        message: "global.condition.multiple-choice.answer-option-selected-preview",
        data: { index: index + 1 },
      },
      type: "boolean",
      defaultOperation: "equal",
      defaultValue: true,
      options: {
        trueLabel: "global.condition.multiple-choice.answer-option-selected-true",
        falseLabel: "global.condition.multiple-choice.answer-option-selected-false",
        equalLabel: "global.condition.multiple-choice.answer-option-selected-equal",
        unequalLabel: "global.condition.multiple-choice.answer-option-selected-unequal",
      },
    };
  });
};

export const formatEvents: MCFormatFunction = function (data) {
  const eventOption: EventOption = {
    name: "answer-submitted",
    parent: data.id,
    conditions: [attempt, response, empty, ...getOptionSelected(data.content)],
    label: {
      message: "global.event.type-answer-submitted",
      hexIcon: calculateHexIcon(data.id),
    },
  };

  data.events = [eventOption];

  return data;
};
