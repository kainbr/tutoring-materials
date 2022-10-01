import type { FTBFormatFunction } from "@/extensions/task/fill-the-blank/types";

export const formatOptions: FTBFormatFunction = function (data) {
  data.options = {
    ...defaultFillTheBlankOptions,
    ...data.options,
  };

  return data;
};

export const defaultFillTheBlankOptions = {};
