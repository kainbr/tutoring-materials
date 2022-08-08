<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <notification-component
        v-for="notificationFeedback in notificationFeedbacks"
        :key="notificationFeedback"
        :feedback="notificationFeedback"
        :editor="editor"
      ></notification-component>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotificationComponent from "@/feedbacks/notification/NotificationComponent.vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Feedback } from "@/types";

export default defineComponent({
  name: "NotificationContainerComponent",

  components: { NotificationComponent },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  computed: {
    notificationFeedbacks() {
      return this.stateStore.feedbacks.filter((s: Feedback) => s.type === "feedback-notification");
    },
  },
});
</script>
