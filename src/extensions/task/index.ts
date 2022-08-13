import TaskComponent from "@/extensions/task/TaskComponent.vue";
import { v4 as uuid } from "uuid";
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    task: {
      /**
       * Todo
       */
      setTask: () => ReturnType;
    };
  }
}

export const Task = Node.create({
  name: "task",

  group: "block",

  content: "(paragraph|list|image|heading)*",

  draggable: true,

  addAttributes() {
    return {
      id: { default: undefined },
      type: { default: "single-choice" },
      content: { default: null },
      evaluation: { default: null },
      feedbacks: { default: [] },
      options: { default: null },
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
    return VueNodeViewRenderer(TaskComponent);
  },

  addCommands() {
    return {
      setTask:
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

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("taskId"),
        appendTransaction: (transaction, oldState, newState) => {
          // Nothing has changed. Ignore it.
          if (newState.doc === oldState.doc) {
            return;
          }

          const tr = newState.tr;

          newState.doc.descendants((node, pos) => {
            if (node.isBlock && node.type.name === "task" && !node.attrs.id) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id: uuid(),
              });
            }
          });

          return tr;
        },
      }),
    ];
  },
});
