import { v4 as uuid } from "uuid";

import type { JSONContent } from "@tiptap/vue-3";

export interface ListOption {
  id: string;
  content: JSONContent;
}

export function useListOptions<C extends ListOption>(): {
  updateAnswerOptionContent: (
    option: C,
    content: C[],
    answerOptionContent: JSONContent,
    update: (attributes: Record<string, unknown>) => void
  ) => void;
  addOption: (content: C[], update: (attributes: Record<string, unknown>) => void) => void;
  moveUpOption: (
    index: number,
    option: C,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => void;
  moveDownOption: (
    index: number,
    option: C,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => void;
  removeOption: (
    index: number,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => void;
} {
  const addOption = (content: C[], update: (attributes: Record<string, unknown>) => void) => {
    if (Array.isArray(content)) {
      content.push(<C>{
        id: uuid(),
        content: { type: "doc", content: [{ type: "paragraph" }] },
      });
      update({ content });
    }
  };

  const removeOption = (
    index: number,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => {
    if (Array.isArray(content)) {
      if (content.length > 1) {
        const contentCopy = content;
        contentCopy.splice(index, 1);
        update({ content: contentCopy });
      }
    }
  };

  const moveUpOption = (
    index: number,
    option: C,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => {
    if (Array.isArray(content)) {
      content.splice(index - 1, 0, option);
      content.splice(index + 1, 1);
      update({ content });
    }
  };

  const moveDownOption = (
    index: number,
    option: C,
    content: C[],
    update: (attributes: Record<string, unknown>) => void
  ) => {
    if (Array.isArray(content)) {
      content.splice(index + 2, 0, option);
      content.splice(index, 1);
      update({ content });
    }
  };

  const updateAnswerOptionContent = (
    option: C,
    content: C[],
    answerOptionContent: JSONContent,
    update: (attributes: Record<string, unknown>) => void
  ) => {
    if (Array.isArray(content)) {
      update({
        content: content.map((o) =>
          option?.id === o.id ? { ...o, content: answerOptionContent } : o
        ),
      });
    }
  };

  return { addOption, removeOption, moveUpOption, moveDownOption, updateAnswerOptionContent };
}
