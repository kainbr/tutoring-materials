<template>
  <transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="mt-1 text-sm text-gray-500">
              <InlineEditor :content="feedback.config.content" />
            </p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="removeActiveFeedback(feedback)"
            >
              <span class="sr-only">Close</span>
              x
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import InlineEditor from "@/helpers/InlineEditor.vue";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { NotificationFeedback } from "@/extensions/feedback/notification/types";
import type { InjectedFeedbacks } from "@/helpers/useFeedbacks";

export default defineComponent({
  name: "NotificationComponent",

  components: { InlineEditor },

  props: {
    feedback: {
      type: Object as PropType<NotificationFeedback>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  setup() {
    const { removeActiveFeedback } = inject("feedbacks") as InjectedFeedbacks;

    return {
      removeActiveFeedback,
    };
  },
});
</script>
