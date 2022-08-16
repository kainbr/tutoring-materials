<template>
  <div class="w-full max-h-52 overflow-auto">
    <span v-if="triggers.length === 0" class="text-sm ml-2.5">{{
      $t("editor.footer.trigger-empty-list")
    }}</span>
    <ul v-else class="divide-y divide-gray-200" role="list">
      <li v-for="(trigger, index) in triggers" :key="trigger.id" class="flex flex-row py-1">
        <div class="px-3.5">
          <span> {{ index + 1 }}. </span>
        </div>
        <EventTriggerComponent
          :key="trigger.id"
          :trigger="trigger"
          :editor="editor"
          class="w-full"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EventTriggerComponent from "./EventTriggerComponent.vue";
import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger } from "@/extensions/feedback/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "EventTriggerListComponent",

  components: { EventTriggerComponent },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    triggers: {
      type: Array as PropType<EventTrigger[]>,
      required: true,
    },
  },
});
</script>
