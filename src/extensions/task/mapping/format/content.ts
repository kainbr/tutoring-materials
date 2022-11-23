import { v4 as uuid } from "uuid";
import type { MAPContent, MAPFormatFunction } from "@/extensions/task/mapping/types";

export const formatContent: MAPFormatFunction = function (data) {
  if (!data.content || !Array.isArray(data.content.source) || !Array.isArray(data.content.target)) {
    data.content = defaultContent;
  } else {
    data.content.source = (data.content.source || []).map((option) => {
      const defaultOption = {
        id: uuid(),
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        },
      };
      return { ...defaultOption, ...option };
    });
    data.content.target = (data.content.target || []).map((option) => {
      const defaultOption = {
        id: uuid(),
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        },
      };
      return { ...defaultOption, ...option };
    });

    while (data.content.target.length < data.content.source.length) {
      data.content.target.push({
        id: uuid(),
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        },
      });
    }
  }

  return data;
};

export const defaultContent: MAPContent = {
  source: [
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
  ],
  target: [
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
  ],
};
