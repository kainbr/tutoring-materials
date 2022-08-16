import { defaultTaskOptions } from "@/extensions/task/helpers";
import type { SCFormatFunction, SCOptions } from "@/extensions/task/single-choice/types";

export const formatOptions: SCFormatFunction<SCOptions> = function ({ newOptions }) {
  return {
    ...defaultTaskOptions,
    ...defaultSingleChoiceOptions,
    ...(!!newOptions ? newOptions : {}),
  };
};

export const defaultSingleChoiceOptions = {
  shuffle: false,
};
