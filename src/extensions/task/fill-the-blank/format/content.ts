import { isEmpty } from "lodash-es";

import type { FTBFormatFunction } from "@/extensions/task/fill-the-blank/types";

export const formatContent: FTBFormatFunction = function (data) {
  if (!data.content || isEmpty(data.content)) {
    data.content = {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    };
  }

  return data;
};
