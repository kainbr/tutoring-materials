import { defaultTaskOptions } from "@/extensions/task/defaults";
import type { SCFormatFunction } from "@/extensions/task/single-choice/types";

export const formatOptions: SCFormatFunction = function (data) {
  data.options = {
    ...defaultTaskOptions,
    ...defaultSingleChoiceOptions,
    ...data.options,
  };

  return data;
};

export const defaultSingleChoiceOptions = {
  shuffle: false,
};
