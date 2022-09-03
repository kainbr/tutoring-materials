import TaskComponent from "@/extensions/task/base/TaskComponent.vue";
import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

export const BaseTask = Node.create({
  name: "task-",

  group: "block",

  content: "(paragraph|list|image|heading)+",

  draggable: true,

  selectable: false,

  addAttributes() {
    return {
      id: { default: null },
      type: { default: "base" },
      content: { default: null },
      evaluation: { default: null },
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
});
