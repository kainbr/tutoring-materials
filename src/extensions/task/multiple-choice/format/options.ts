import type { MCFormatFunction } from "@/extensions/task/multiple-choice/types";

export const formatOptions: MCFormatFunction = function (data) {
  data.options = {
    ...defaultMultipleChoiceOptions,
    ...data.options,
  };

  return data;
};

export const defaultMultipleChoiceOptions = {
  shuffle: false,
};
