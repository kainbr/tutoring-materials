import { v4 as uuid } from "uuid";
import type { MCFormatFunction, MCOption } from "@/extensions/task/multiple-choice/types";

export const formatContent: MCFormatFunction = function (data) {
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

export const defaultContent: MCOption[] = [
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
