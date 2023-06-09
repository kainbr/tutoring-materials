import type { STFormatFunction } from "@/extensions/task/short-text/types";

export const formatContent: STFormatFunction = function(data) {
  data.content = {};
  return data;
};
