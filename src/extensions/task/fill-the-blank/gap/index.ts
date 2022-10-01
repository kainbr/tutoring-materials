import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import GapComponent from "@/extensions/task/fill-the-blank/gap/GapComponent.vue";
import { Plugin, PluginKey } from "prosemirror-state";
import { v4 as uuid } from "uuid";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    gap: {
      /**
       * Inserts a gap with select type into the document.
       */
      insertGap: () => ReturnType;
    };
  }
}

export const Gap = Node.create({
  name: "gap",

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      options: {
        default: [],
      },
    };
  },

  addCommands() {
    return {
      insertGap:
        () =>
        ({ commands }) => {
          commands.insertContent({
            type: this.name,
            attrs: {
              id: uuid(),
              options: [],
            },
          });

          return true;
        },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(GapComponent);
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("gap-id"),
        appendTransaction: (transaction, oldState, state) => {
          // Nothing has changed. Ignore it.
          if (state.doc === oldState.doc) {
            return;
          }

          const tr = state.tr;

          // Add id
          state.doc.descendants((node, pos) => {
            if (node.isInline && node.type.name === "gap" && !node.attrs.id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: uuid(),
              });
            }

            // Add default option
            if (
              node.isInline &&
              node.type.name === "gap" &&
              (!node.attrs.options || node.attrs.options.length < 1)
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                options: [
                  {
                    id: uuid(),
                    text: "",
                  },
                ],
              });
            }
          });

          return tr;
        },
      }),
    ];
  },
});
