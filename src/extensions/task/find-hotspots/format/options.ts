import type { FHFormatFunction } from "@/extensions/task/find-hotspots/types";

export const formatOptions: FHFormatFunction = function (data) {
  const defaultOptions = {
    hideSubmitButton: true,
    hasDisabledCheckTimer: false
  };

  data.options = {
    ...defaultOptions,
    ...data.options,
  };

  return data;
};
