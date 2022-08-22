<template>
  <div class="w-full">
    <!-- Empty list -->
    <span v-if="feedbacks.length === 0" class="text-sm ml-2.5">
      {{ $t("editor.footer.feedback-empty-list") }}
    </span>

    <!-- Loop over all provided feedbacks -->
    <ul v-else class="p-0 m-0 divide-y divide-gray-200 list-none" role="list">
      <li v-for="feedback in feedbacks" :key="feedback.id" class="py-1 m-0">
        <component
          :is="feedback.type"
          :key="feedback.config"
          :editor="editor"
          :feedback="feedback"
          :create-feedback="createFeedback"
          :update-feedback="updateFeedback"
          :remove-feedback="removeFeedback"
        ></component>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FeedbackHint from "@/extensions/feedback/hint/ConfigurationComponent.vue";
import FeedbackMark from "@/extensions/feedback/mark/ConfigurationComponent.vue";
import FeedbackNotification from "@/extensions/feedback/notification/ConfigurationComponent.vue";

import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { StoredFeedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "FeedbackListComponent",

  components: {
    "feedback-hint": FeedbackHint,
    "feedback-mark": FeedbackMark,
    "feedback-notification": FeedbackNotification,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    feedbacks: {
      type: Array as PropType<StoredFeedback[]>,
      required: true,
    },
    createFeedback: {
      type: Function,
      required: true,
    },
    updateFeedback: {
      type: Function,
      required: true,
    },
    removeFeedback: {
      type: Function,
      required: true,
    },
  },
});
</script>
