import type { MAPFormatFunction } from "@/extensions/task/mapping/types";

export const formatOptions: MAPFormatFunction = function (data) {
  data.options = {
    ...defaultMappingOptions,
    ...data.options,
  };

  return data;
};

export const defaultMappingOptions = {};
