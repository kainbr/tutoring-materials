import type { STFormatFunction } from "@/extensions/task/short-text/types";

export const formatOptions: STFormatFunction = function(data) {
  const defaultOptions = {};

  data.options = {
    ...defaultOptions,
    ...data.options
  };

  return data;
};
