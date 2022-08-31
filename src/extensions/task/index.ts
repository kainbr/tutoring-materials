// noinspection JSUnusedGlobalSymbols

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { v4 as uuid } from "uuid";

export const Task = Extension.create({
  name: "tasks",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("task-id"),
        appendTransaction: (transaction, oldState, state) => {
          // Nothing has changed. Ignore it.
          if (state.doc === oldState.doc) {
            return;
          }

          const tr = state.tr;

          state.doc.descendants((node, pos) => {
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
