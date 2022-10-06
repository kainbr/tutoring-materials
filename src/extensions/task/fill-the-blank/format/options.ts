import type { FTBFormatFunction } from "@/extensions/task/fill-the-blank/types";
import i18n from "@/i18n";

export const formatOptions: FTBFormatFunction = function (data) {
  const defaultFillTheBlankOptions = {
    textSelectGapPlaceholder: i18n.global.t("global.options.text-select-gap-placeholder"),
    lockCorrectOptions: true,
  };

  data.options = {
    ...defaultFillTheBlankOptions,
    ...data.options,
  };

  return data;
};
