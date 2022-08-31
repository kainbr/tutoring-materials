// noinspection JSUnusedGlobalSymbols

import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import InfoboxComponent from "./InfoboxComponent.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    infobox: {
      /**
       * Adds an infobox to the current document.
       */
      setInfobox: () => ReturnType;
    };
  }
}

export const Infobox = Node.create({
  name: "infobox",

  group: "block",

  content: "(paragraph|list|image|heading)+",

  draggable: true,

  selectable: false,

  addAttributes() {
    return {
      color: {
        default: "blue",
      },
      icon: {
        default: "icon-exclamation-mark",
      },
    };
  },

  addCommands() {
    return {
      setInfobox:
        () =>
        ({ commands }) => {
          commands.insertContent({
            type: this.name,
            content: [
              {
                type: "paragraph",
              },
            ],
          });
          return true;
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(InfoboxComponent);
  },
});
