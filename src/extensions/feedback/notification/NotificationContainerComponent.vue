<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
  >
    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
      <!--suppress JSValidateTypes -->
      <notification-component
        v-for="activeNotificationFeedback in activeNotificationFeedbacks"
        :key="activeNotificationFeedback"
        :feedback="activeNotificationFeedback"
        :editor="editor"
      ></notification-component>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import NotificationComponent from "@/extensions/feedback/notification/NotificationComponent.vue";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";
import type { ProvidedFeedbacks } from "@/helpers/useFeedbacks";

export default defineComponent({
  name: "NotificationContainerComponent",

  components: { NotificationComponent },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  setup() {
    const { activeFeedbacks } = inject("feedbacks") as ProvidedFeedbacks;

    const activeNotificationFeedbacks = computed(() => {
      return (
        activeFeedbacks.value.filter((s: Feedback) => s.type === "feedback-notification") || []
      );
    });

    return {
      activeNotificationFeedbacks,
    };
  },
});
</script>
