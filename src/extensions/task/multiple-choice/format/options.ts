import type { MCFormatFunction } from "@/extensions/task/multiple-choice/types";

export const formatOptions: MCFormatFunction = function(data) {
  const defaultOptions = {
    shuffle: false,
    showPartiallyCorrectCount: false
  };

  data.options = {
    ...defaultOptions,
    ...data.options
  };

  return data;
};
