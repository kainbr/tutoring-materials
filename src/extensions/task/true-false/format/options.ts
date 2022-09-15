import type { TFFormatFunction } from "@/extensions/task/true-false/types";
import i18n from "@/i18n";

export const formatOptions: TFFormatFunction = function (data) {
  const defaultTrueFalseOptions = {
    shuffle: false,
    trueLabel: i18n.global.t("global.options.text-true-label"),
    falseLabel: i18n.global.t("global.options.text-false-label"),
  };

  data.options = {
    ...defaultTrueFalseOptions,
    ...data.options,
    maxAttempts: 1,
  };

  return data;
};
