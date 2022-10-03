import { getDefaultTaskState } from "@/extensions/task/defaults";
import type { FHFormatFunction } from "@/extensions/task/find-hotspots/types";

export const formatState: FHFormatFunction = function (data) {
  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "find-hotspots",
  };

  return data;
};
