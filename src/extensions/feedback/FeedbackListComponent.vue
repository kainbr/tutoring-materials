<template>
  <div class="w-full">
    <!-- Empty list -->
    <span v-if="feedbacks.length === 0" class="text-sm ml-2.5">
      {{ $t("editor.footer.feedback-empty-list") }}
    </span>

    <!-- Loop over all list entries -->
    <ul v-else class="divide-y divide-gray-200" role="list">
      <li v-for="feedback in feedbacks" :key="feedback.id" class="py-1">
        <component
          :is="feedback.type"
          :key="feedback.config"
          :editor="editor"
          :feedback="feedback"
        ></component>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FeedbackMark from "@/extensions/feedback/mark/ConfigurationComponent.vue";
import FeedbackNotification from "@/extensions/feedback/notification/ConfigurationComponent.vue";

import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { StoredFeedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "FeedbackListComponent",

  components: {
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
  },
});
</script>
