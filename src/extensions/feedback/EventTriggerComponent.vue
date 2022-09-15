<template>
  <div class="flex flex-row w-full justify-between">
    <div class="flex flex-row flex-wrap items-center grow gap-y-1 py-1">
      <EventSelector
        :event-options="editor.storage.feedbacks.eventOptions"
        :trigger="trigger"
        @update:event="updateEventTrigger"
      />

      <ConditionSelector :conditions="conditions" :trigger="trigger" @update:rules="updateRules" />

      <FeedbackSelector
        :feedbacks="feedbacks"
        :trigger="trigger"
        :editor="editor"
        @update:feedbacks="updateFeedbacks"
      />
    </div>

    <!-- Standard buttons -->
    <div class="flex gap-0.5 ml-3 h-fit">
      <EditorMenuButton :on-inactive-click="() => addEventTrigger(trigger)">
        <IconCopy />
      </EditorMenuButton>
      <EditorMenuButton :on-inactive-click="() => editor.commands.removeEventTrigger(trigger)">
        <IconTrash />
      </EditorMenuButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { v4 as uuid } from "uuid";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import EventSelector from "@/extensions/feedback/helpers/EventSelector.vue";
import ConditionSelector from "@/extensions/feedback/helpers/ConditionSelector.vue";
import FeedbackSelector from "@/extensions/feedback/helpers/FeedbackSelector.vue";

import type { Editor } from "@tiptap/vue-3";
import type { EventOption, EventRule, EventTrigger } from "@/extensions/feedback/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "EventTriggerComponent",

  components: {
    EditorMenuButton,
    IconCopy,
    IconTrash,
    FeedbackSelector,
    ConditionSelector,
    EventSelector,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      required: true,
    },
  },

  setup(props) {
    const conditions = computed(() => {
      const eventOption = props.editor.storage.feedbacks.eventOptions.find(
        (o: EventOption) => o.name === props.trigger.event && o.parent === props.trigger.parent
      );
      return !eventOption ? [] : eventOption.conditions;
    });

    const feedbacks = computed(() => props.editor.getAttributes("document").feedbacks);

    const addEventTrigger = (trigger: EventTrigger) => {
      props.editor.commands.addEventTrigger({ ...trigger, id: uuid() });
    };

    const updateEventTrigger = ($event: { name: string; parent: string }) => {
      props.editor.commands.updateEventTrigger(props.trigger, {
        ...props.trigger,
        event: $event.name,
        parent: $event.parent,
      });
    };

    const updateRules = ($event: EventRule[]) => {
      props.editor.commands.updateEventTrigger(props.trigger, {
        rules: $event,
      });
    };

    const updateFeedbacks = ($event: string[]) => {
      props.editor.commands.updateEventTrigger(props.trigger, {
        feedbacks: $event,
      });
    };

    return {
      conditions,
      feedbacks,
      addEventTrigger,
      updateEventTrigger,
      updateRules,
      updateFeedbacks,
    };
  },
});
</script>
