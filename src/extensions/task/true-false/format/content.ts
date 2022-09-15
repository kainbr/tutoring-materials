import { v4 as uuid } from "uuid";

import type { TFFormatFunction, TFOption } from "@/extensions/task/true-false/types";

export const formatContent: TFFormatFunction = function (data) {
  if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
    data.content = defaultContent;
  } else {
    data.content = data.content.map((option) => {
      const defaultOption = {
        id: uuid(),
        content: {
          type: "doc",
        },
      };
      return { ...defaultOption, ...option };
    });
  }

  return data;
};

export const defaultContent: TFOption[] = [
  {
    id: uuid(),
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
  },
];
