import { findChildren } from "@tiptap/core";
import { provide, ref } from "vue";

import type { Ref } from "vue";
import type { EventOption } from "@/extensions/feedback/types";
import type { Editor } from "@tiptap/vue-3";
import type { NodeWithPos } from "@tiptap/vue-3";

export type InjectedEventOptions = {
  eventOptions: Ref<EventOption[]>;
  addEventOption: (eventOption: EventOption) => void;
  removeEventOption: (eventOption: EventOption) => void;
};

export default function (editor: Editor): InjectedEventOptions {
  const eventOptions: Ref<EventOption[]> = ref([]);

  const addEventOption = (eventOption: EventOption) => {
    const option = eventOptions.value.find(
      (o: EventOption) => o.name === eventOption.name && o.parent === eventOption.parent
    );
    if (!option) {
      eventOptions.value = [...eventOptions.value, eventOption];
    }
  };

  const removeEventOption = (eventOption: EventOption) => {
    eventOptions.value = eventOptions.value.filter(
      (o: EventOption) => o.name !== eventOption.name && o.parent !== eventOption.parent
    );
  };

  editor.on("update", ({ editor }) => {
    // Cleanup events that do not have a valid parent anymore
    const taskIds = findChildren(editor.state.doc, (node) => node.type.name === "task").map(
      (node: NodeWithPos) => node.node.attrs.id
    );
    eventOptions.value = eventOptions.value.filter(
      (e: EventOption) => e.parent === null || taskIds.includes(e.parent)
    );
  });

  provide("eventOptions", {
    eventOptions,
    addEventOption,
    removeEventOption,
  });

  return {
    eventOptions,
    addEventOption,
    removeEventOption,
  };
}
