// Inspired by https://github.com/benrbray/prosemirror-math/issues/27
import { Extension } from "@tiptap/core";
import { inputRules } from "prosemirror-inputrules";
import { Node, mergeAttributes } from "@tiptap/core";

import {
  makeInlineMathInputRule,
  REGEX_INLINE_MATH_DOLLARS,
  mathPlugin,
  // makeBlockMathInputRule,
  // REGEX_BLOCK_MATH_DOLLARS,
} from "@benrbray/prosemirror-math";

export const Math = Extension.create({
  addExtensions() {
    return [/*MathBlock,*/ MathInline];
  },

  addProseMirrorPlugins() {
    return [mathPlugin];
  },
});

const MathInline = Node.create({
  name: "math_inline",
  group: "inline math",
  content: "text*",
  inline: true,
  atom: true,
  code: true,

  parseHTML() {
    return [
      {
        tag: "math-inline",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-inline", mergeAttributes({ class: "math-node" }, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    return [
      inputRules({
        rules: [makeInlineMathInputRule(REGEX_INLINE_MATH_DOLLARS, this.type)],
      }),
    ];
  },
});

/*
Todo: Fix MathBlock node
const MathBlock = Node.create({
  name: "math_display",
  group: "block math",
  content: "text*",
  atom: true,
  code: true,

  parseHTML() {
    return [
      {
        tag: "math-display",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-display", mergeAttributes({ class: "math-node" }, HTMLAttributes), 0];
  },

  addProseMirrorPlugins() {
    return [
      inputRules({
        rules: [makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, this.type)],
      }),
    ];
  },
});
 */
