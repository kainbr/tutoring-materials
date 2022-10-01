import type { JSONContent } from "@tiptap/vue-3";

export function findGaps(node: JSONContent): JSONContent[] {
  const gaps: JSONContent[] = [];

  const helper = (node: JSONContent) => {
    node.content?.forEach((node: JSONContent) => {
      if (node.type === "gap") {
        gaps.push(node);
      }

      if (!!node.content) {
        helper(node);
      }
    });
  };

  helper(node);

  return gaps;
}
