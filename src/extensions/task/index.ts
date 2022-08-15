import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { v4 as uuid } from "uuid";

export const Task = Extension.create({
  name: "task",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("task-id"),
        appendTransaction: (transaction, oldState, newState) => {
          // Nothing has changed. Ignore it.
          if (newState.doc === oldState.doc) {
            return;
          }

          const tr = newState.tr;

          newState.doc.descendants((node, pos) => {
            if (node.isBlock && node.type.name.startsWith("task-") && !node.attrs.id) {
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
