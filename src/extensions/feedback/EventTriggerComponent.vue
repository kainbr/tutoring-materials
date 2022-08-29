<template>
  <div class="flex flex-row justify-between">
    <div class="flex flex-row flex-wrap items-center grow gap-y-1 py-1">
      <EventSelector :events="events" :trigger="trigger" @update:event="updateEvent" />

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
import { defineComponent } from "vue";
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

  computed: {
    events() {
      return this.editor.storage.feedbacks.events;
    },
    conditions() {
      const eventOption = this.editor.storage.feedbacks.events.find(
        (o: EventOption) => o.name === this.trigger.event && o.parent === this.trigger.parent
      );

      if (!!eventOption) {
        return eventOption.conditions;
      } else {
        return [];
      }
    },
    feedbacks() {
      return this.editor.getAttributes("document").feedbacks;
    },
  },

  methods: {
    addEventTrigger(trigger: EventTrigger) {
      this.editor.commands.addEventTrigger({ ...trigger, id: uuid() });
    },
    updateEvent($event: { name: string; parent: string }) {
      this.editor.commands.updateEventTrigger(this.trigger, {
        ...this.trigger,
        event: $event.name,
        parent: $event.parent,
      });
    },
    updateRules($event: EventRule[]) {
      this.editor.commands.updateEventTrigger(this.trigger, {
        rules: $event,
      });
    },
    updateFeedbacks($event: string[]) {
      this.editor.commands.updateEventTrigger(this.trigger, {
        feedbacks: $event,
      });
    },
  },
});
</script>
