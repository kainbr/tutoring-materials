<template>
  <div class="w-full">
    <span v-if="feedbacks.length === 0" class="text-sm ml-2.5">{{
      $t("editor.footer.feedback-empty-list")
    }}</span>
    <ul v-else class="divide-y divide-gray-200" role="list">
      <li
        v-for="feedback in feedbacks"
        :key="feedback.id"
        class="py-1"
        @mouseenter="stateStore.addFeedback(feedback)"
        @mouseleave="stateStore.removeFeedback(feedback)"
      >
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
import FeedbackMark from "./mark/ConfigurationComponent.vue";
import FeedbackNotification from "./notification/ConfigurationComponent.vue";
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { Feedback } from "@/types";

export default defineComponent({
  name: "FeedbackConfigurationComponent",

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
      type: Array as PropType<Feedback[]>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },
});
</script>
