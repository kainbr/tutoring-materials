import type { SCFormatFunction, SCOptions } from "@/tasks/single-choice/types";
import { defaultTaskOptions } from "@/tasks";

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
