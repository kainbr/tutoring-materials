import type { SCFormatFunction } from "@/extensions/task/single-choice/types";

export const formatOptions: SCFormatFunction = function (data) {
  data.options = {
    ...defaultSingleChoiceOptions,
    ...data.options,
  };

  return data;
};

export const defaultSingleChoiceOptions = {
  shuffle: false,
};
