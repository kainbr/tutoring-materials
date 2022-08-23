import { defaultTaskOptions } from "@/extensions/task/defaults";
import type { SCFormatFunction } from "@/extensions/task/single-choice/types";

export const formatOptions: SCFormatFunction = function (data) {
  data.newOptions = {
    ...defaultTaskOptions,
    ...defaultSingleChoiceOptions,
    ...(!!data.newOptions ? data.newOptions : {}),
  };

  return data;
};

export const defaultSingleChoiceOptions = {
  shuffle: false,
};
