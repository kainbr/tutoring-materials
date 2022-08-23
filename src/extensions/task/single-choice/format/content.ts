import { v4 as uuid } from "uuid";
import type { SCFormatFunction, SCOption } from "@/extensions/task/single-choice/types";

export const formatContent: SCFormatFunction = function (data) {
  if (!data.content || !Array.isArray(data.content)) {
    // Set content to default if the input is no array
    data.content = defaultContent;
  } else {
    // Add necessary attributes to each answer option
    data.content = data.content.map((option) => {
      const defaultOption = {
        id: uuid(),
        content: {
          type: "doc",
          content: undefined,
        },
      };
      return { ...defaultOption, ...option };
    });
  }

  return data;
};

export const defaultContent: SCOption[] = [
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
