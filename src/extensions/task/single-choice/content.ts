import { v4 as uuid } from "uuid";
import type { SCFormatFunction, SCOption } from "@/tasks/single-choice/types";

export const formatContent: SCFormatFunction<SCOption[]> = function ({ newContent }) {
  let content: SCOption[];

  if (!newContent || !Array.isArray(newContent)) {
    // Set content to default if the input is no array
    content = defaultContent;
  } else {
    // Add necessary attributes to each answer option
    content = newContent.map((option) => {
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

  return content;
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
